FROM ubuntu:latest
LABEL maintainer="gabrielsrosvalds"

RUN apt-get update && apt-get install -y \
    php-cli php-mbstring php-xml php-bcmath php-curl php-mysql php-zip php-tokenizer \
    php-common php-json php-pdo php-gd unzip curl git nginx supervisor mysql-client \
    && apt-get clean

WORKDIR /var/www/html

COPY . .

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage

COPY ./docker/nginx/default /etc/nginx/sites-available/default

EXPOSE 8000

COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD ["/usr/bin/supervisord"]
