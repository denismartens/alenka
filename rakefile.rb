require_relative 'app.rb'
require 'mini_magick'

task :create_thumbnails do
  bucket = AWS::S3::Bucket.find(ENV['AWS_BUCKET_NAME'])
  images_dir = "http://s3.amazonaws.com/#{bucket.name}"
  bucket.objects(:prefix => 'portfolio').each do |img|
  	next unless img.about['content-type'] == 'image/jpeg'
  	thumbnail = MiniMagick::Image.open(File.join(images_dir, img.key)).resize('250')
  	thumbnail_name = img.key.gsub(/\/(?<name>.*)$/,'/thumbnail_\k<name>')
  	AWS::S3::S3Object.store(thumbnail_name, thumbnail.to_blob, bucket.name) unless AWS::S3::S3Object.exists?(thumbnail_name, bucket.name)
  end
end