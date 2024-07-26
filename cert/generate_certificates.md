# How to use OpenSSL To generate SSL Certificates

If you are using git, just use git bash OpenSSL is already installed.

## Here is how to use the bash:

```bash
openssl genrsa -out cert/key.pem 2048
openssl req -new -key cert/key.pem -out cert/csr.pem
openssl x509 -req -days 365 -in cert/csr.pem -signkey cert/key.pem -out cert/cert.pem

```
