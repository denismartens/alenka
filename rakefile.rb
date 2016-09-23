require_relative 'app.rb'
require 'mini_magick'
require 'optparse'

task :create_thumbnails do
	options = {:replace => false}
	OptionParser.new do |opts|
		opts.on('--replace', 'Replace existing thumbnail images') do
			options[:replace] = true
		end
	end.parse!
  bucket = AWS::S3::Bucket.find(ENV['AWS_BUCKET_NAME'])
  images_dir = "http://s3.amazonaws.com/#{bucket.name}"
  bucket.objects(:prefix => 'portraits').each do |img|
  	next if img.about['content-type'] != 'image/jpeg' || img.key.include?('thumbnail')
  	thumbnail_name = img.key.gsub(/\/(?<name>.*)$/,'/thumbnail_\k<name>')
  	next if AWS::S3::S3Object.exists?(thumbnail_name, bucket.name) && !options[:replace]
  	thumbnail_img = MiniMagick::Image.open(File.join(images_dir, img.key)).resize('350')
  	AWS::S3::S3Object.delete(thumbnail_name, bucket.name) if AWS::S3::S3Object.exists?(thumbnail_name, bucket.name)
		AWS::S3::S3Object.store(thumbnail_name, thumbnail_img.to_blob, bucket.name)
  end
end