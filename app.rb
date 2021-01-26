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

BUCKET = AWS::S3::Bucket.find(ENV['AWS_BUCKET_NAME'])
BUCKET_URL = "https://s3.amazonaws.com/#{BUCKET.name}"

%w[/ /portraits /travel /children /family /maternity /about /contact /pricing].each do |path|
	get path do
		@current_path = path
    @is_portfolio_page = false
    case path
    when '/'
      @carousel_images = filter_images(BUCKET.objects(prefix: 'landing/slides'))
      @grid_images = filter_images(BUCKET.objects(prefix: 'landing/thumbnails'))
      erb :landing
    when '/about'
      @banner_image = File.join(BUCKET_URL, AWS::S3::S3Object.find('banners/pricing.jpg', BUCKET.name).key)
      @headshot_image = File.join(BUCKET_URL, AWS::S3::S3Object.find('about/about.jpg', BUCKET.name).key)
      erb :about
    when '/contact'
      @banner_image = File.join(BUCKET_URL, AWS::S3::S3Object.find('banners/pricing.jpg', BUCKET.name).key)
      erb :contact
    when '/pricing'
      @banner_image = File.join(BUCKET_URL, AWS::S3::S3Object.find('banners/pricing.jpg', BUCKET.name).key)
      erb :pricing
    when '/portraits', '/travel', '/children', '/family', '/maternity'
      @is_portfolio_page = true
      folder = @current_path.match(/portraits|travel|children|family|maternity/).to_s
      @grid_images = filter_images(BUCKET.objects(
        max_keys: 16,
        prefix: "#{folder}/thumbnails",
        marker: "#{folder}/thumbnails/#{params[:marker]}"))
      if request.xhr?
        erb :images, layout: false
      else
        @carousel_images = filter_images(BUCKET.objects(prefix: "#{folder}/slides"))
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
        user_name: 'apikey', 
        password: ENV['SENDGRID_KEY'], 
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

def filter_images(s3_objects)
  return s3_objects.keep_if{|obj| obj.about['content-type'] == 'image/jpeg'}.map{|img| File.join(BUCKET_URL, img.key)}
end
