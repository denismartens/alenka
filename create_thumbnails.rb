# frozen_string_literal: true
#!/usr/bin/env ruby
require_relative 'app.rb'
require 'mini_magick'
require 'optparse'

options = {replace: false}
OptionParser.new do |opts|
  opts.banner = 'Usage: create_thumbnails.rb [options]'
	opts.on('-r', '--replace', 'Replace existing thumbnail images') do
		options[:replace] = true
	end
  opts.on('-d', '--directory NAME', 'Directory NAME where to look for images') do |path|
    options[:path] = path
  end
end.parse!
raise 'Directory not provided, please provide a directory' if options[:path].nil?
bucket = AWS::S3::Bucket.find(ENV['AWS_BUCKET_NAME'])
images_dir = "http://s3.amazonaws.com/#{bucket.name}"
if options[:replace]
  bucket.objects(prefix: options[:path] + '/thumbnails')
        .keep_if{|obj| obj.about['content-type'] == 'image/jpeg'}
        .each do |img|
          AWS::S3::S3Object.delete(img.key, bucket.name)
          puts "Deleted thumbnail #{img.key}"
  end
end
bucket.objects(prefix: options[:path] + '/slides').each do |img|
  # skip object if not an image or is already a thumbnail image
	next if img.about['content-type'] != 'image/jpeg'
  # skip object if its thumbnail version already exists and replace option is false
  thumbnail_path = img.key.gsub(/slides\/(?<name>.*)$/, 'thumbnails/\k<name>')
	if AWS::S3::S3Object.exists?(thumbnail_path, bucket.name)
    next
  end
  # create new thumbnail image and overwrite existing if needed
	thumbnail_img = MiniMagick::Image.open(File.join(images_dir, img.key)).resize('600')
  AWS::S3::S3Object.store(thumbnail_path, thumbnail_img.to_blob, bucket.name, content_type: 'image/jpeg')
  puts "Created thumbnail #{thumbnail_path} for #{img.key}"
end