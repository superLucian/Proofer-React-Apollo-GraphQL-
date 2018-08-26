FROM debian:jessie

MAINTAINER Marco Madarco D'Alia <docker@madarco.it>

ARG environment=local

RUN apt-get update && apt-get install -y nginx

# Global Nginx conf
ADD docker/nginx/nginx.conf /etc/nginx/

# Site-specific configurations:
ADD docker/nginx/frontend.conf /etc/nginx/sites-available/
ADD nginx/ /var/www/sites/nginx/

# Environment-specific configurations
RUN mv /var/www/sites/nginx/env/${environment}/* /var/www/sites/nginx/

# Enabled the virtual-host:
RUN mkdir -p /var/www/sites/logs/frontend \
    mkdir -p /var/www/sites/frontend/var \
	&& ln -s /etc/nginx/sites-available/frontend.conf /etc/nginx/sites-enabled/frontend \
	&& rm /etc/nginx/sites-enabled/default

RUN touch /var/www/sites/frontend/var/healthy

RUN usermod -u 1000 www-data

CMD ["nginx"]

EXPOSE 80
EXPOSE 443
