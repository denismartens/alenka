#!/usr/bin/env ruby
require_relative 'app.rb'
require 'mini_magick'
require 'optparse'

options = {:replace => false}
OptionParser.new do |opts|
  opts.banner = "Usage: create_thumbnails.rb [options]"
	opts.on('-r', '--replace', 'Replace existing thumbnail images') do
		options[:replace] = true
	end
  opts.on('-d', '--directory NAME', 'Directory NAME where to look for images') do |path|
    options[:path] = path
  end
end.parse!
raise "Directory not provided, please provide a directory" if options[:path].nil?
bucket = AWS::S3::Bucket.find(ENV['AWS_BUCKET_NAME'])
images_dir = "http://s3.amazonaws.com/#{bucket.name}"
bucket.objects(:prefix => options[:path]).each do |img|
  # skip object if not an image or is already a thumbnail image
	next if img.about['content-type'] != 'image/jpeg' || img.key.include?('thumbnail')
	thumbnail_name = img.key.gsub(/\/(?<name>.*)$/,'/thumbnail_\k<name>')
  # skip object if its thumbnail version already exists and replace option is false
	next if AWS::S3::S3Object.exists?(thumbnail_name, bucket.name) && !options[:replace]
  # create new thumbnail image and overwrite existing if needed
	thumbnail_img = MiniMagick::Image.open(File.join(images_dir, img.key)).resize('350')
  AWS::S3::S3Object.delete(thumbnail_name, bucket.name) if AWS::S3::S3Object.exists?(thumbnail_name, bucket.name)
  AWS::S3::S3Object.store(thumbnail_name, thumbnail_img.to_blob, bucket.name)
  logger.info "Created thumbnail for #{img.key}"
end