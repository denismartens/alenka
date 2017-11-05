require 'sinatra'
require 'pony'
require 'dotenv'
require 'aws/s3'

configure { set :server, :puma }

Dotenv.load

AWS::S3::Base.establish_connection!(
  access_key_id: ENV['AWS_ACCESS_KEY_ID'],
  secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
)

%w[/ /about /children /engagement /family /maternity /newborn /wedding].each do |path|
	get path do
		@current_path = path
    bucket = AWS::S3::Bucket.find(ENV['AWS_BUCKET_NAME'])
    bucket_url = "http://s3.amazonaws.com/#{bucket.name}"
    if @current_path == '/'
      @images = bucket.objects(max_keys: params[:number] || 25, prefix: 'landing/', marker: "landing/#{params[:marker]}").map{|img| File.join(bucket_url, img.key)}
      request.xhr? ? (erb :images, locals: {type: :carousel}, layout: false) : (erb :landing)
    elsif @current_path == '/about'
      @images = bucket.objects(prefix: "about/headshot").map{|img| File.join(bucket_url, img.key)}
      erb :about
    else
      folder = @current_path.match(/children|engagement|family|maternity|newborn|wedding/).to_s
      @images = bucket.objects(max_keys: params[:number] || 25, prefix: "#{folder}/thumbnail_", marker: "#{folder}/#{params[:marker]}").map{|img| File.join(bucket_url, img.key)}
      request.xhr? ? (erb :images, locals: {type: params[:type].to_sym}, layout: false) : (erb :images_grid)
    end
	end
end

get '/contact' do
  erb :contact
end

get '/pricing' do
  erb :pricing
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
    erb :alert, locals: {notice: 'success'}, layout: false
  rescue
    logger.info('failure')
    erb :alert, locals: {notice: 'failure'}, layout: false
  end
end