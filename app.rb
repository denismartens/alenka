# frozen_string_literal: true

require 'sinatra'
require 'pony'
require 'dotenv'
require 'aws/s3'
require 'mini_magick'

configure { set :server, :puma }

Dotenv.load

AWS::S3::Base.establish_connection!(
  access_key_id: ENV['AWS_ACCESS_KEY_ID'],
  secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
)

bucket = AWS::S3::Bucket.find(ENV['AWS_BUCKET_NAME'])
bucket_url = "http://s3.amazonaws.com/#{bucket.name}"

%w[/ /portraits /travel /children /family /maternity /about /contact /pricing].each do |path|
	get path do
		@current_path = path
    case path
    when '/'
      @carousel_images = bucket.objects(prefix: 'landing/slides').map{|img| File.join(bucket_url, img.key)}
      @grid_images = bucket.objects()
      erb :landing
    when '/about'
      @banner_image = File.join(bucket_url, AWS::S3::S3Object.find('banners/about.jpg', bucket.name).key)
      erb :about
    when '/contact'
      @banner_image = File.join(bucket_url, AWS::S3::S3Object.find('banners/about.jpg', bucket.name).key)
      erb :contact
    when '/pricing'
      @banner_image = File.join(bucket_url, AWS::S3::S3Object.find('banners/pricing.jpg', bucket.name).key)
      erb :pricing
    when '/portraits', '/travel', '/children', '/family', '/maternity'
      folder = @current_path.match(/portraits|travel|children|family|maternity/).to_s
      @grid_images = bucket.objects(
        max_keys: 8,
        prefix: "#{folder}/thumbnails/",
        marker: "#{folder}/thumbnails/#{params[:marker]}")
      .map{|img|
        File.join(bucket_url, img.key)}
      if request.xhr?
        erb :images, layout: false
      else
        @carousel_images = bucket.objects(prefix: "#{folder}/slides/").map{|img| File.join(bucket_url, img.key)}
        erb :images_grid
      end
    end
	end
end

post '/contact' do 
  name = params[:name]
  sender_email = params[:email]
  message = params[:message]
  begin
    Pony.mail(
      from: "#{name}<#{sender_email}>",
      to: ENV['EMAIL'],
      subject:"#{name} says hello!",
      body: "#{message}",
      via: :smtp,
      via_options: { 
        address: 'smtp.sendgrid.net', 
        port: '587',
        domain: 'heroku.com',
        user_name: ENV['SENDGRID_USERNAME'], 
        password: ENV['SENDGRID_PASSWORD'], 
        authentication: :plain, 
        enable_starttls_auto: true
	    }
    )
    logger.info('success')
    erb :alert, locals: {notice: 'success', text: 'Thank you, your message has been sent!'}, layout: false
  rescue
    logger.info('failure')
    erb :alert, locals: {notice: 'failure', text: 'Sorry, your message could not be sent.'}, layout: false
  end
end