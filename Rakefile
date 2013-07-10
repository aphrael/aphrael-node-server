# Heroku server
task :github_push do
  sh 'git push origin feature'
end

task :heroku_deploy => [:github_push] do
  sh 'git push heroku feature'
end

task :heroku_create do
  sh "heroku create --stack cedar aphrael-node-server"
end

task :timezone do
  sh "heroku config:add TZ=Asia/Tokyo"
end

task :heroku_start do
  sh "heroku scale web=1"
end

task :heroku_stop do
  sh "heroku scale web=0"
end