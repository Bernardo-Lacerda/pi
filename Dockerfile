FROM php:8.3-apache

RUN docker-php-ext-install pdo pdo_mysql mysqli

RUN a2enmod rewrite headers

COPY docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

COPY . /var/www/html

EXPOSE 80