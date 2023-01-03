const admin = require('firebase-admin');

const firebaseConfig = {
  type: 'service_account',
  project_id: 'bini-83648',
  private_key_id: '2f98264aa1eb29485900f7aa9d3146a95d31913b',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCRubyzBePF1dN+\n9o2Icj+BcuNDmwt4g0PD8EG55DEGlzvOixmMelWu55/i9d3S3N9Mt7V1tUguVYtB\nmKGsa+epnwYvlOxPgyWwO9jy1lUq+odS4eVhPkSW0xp9DzjB/xqpYxrpCkJK7nlG\n3U637zYnn1BZ0hZ9az/Uy4zAa6flRdi1CNzKJVSj5N1eEoVpIkiB5cA7E+KtXyfc\nF+r2//6FP+Z1rPnKBQhdlQSGcEfvOMGI0qbvE1/KuI7jl01GnuVVOeSdeKq8zfAK\nkCCxVTu59WebnQ31eij/FNW4kKHRn2P3Mh4S+/e4Us/eIHqZjnrbG507BbmPV50o\nF1YsVGu7AgMBAAECggEAArLz0EWyfMu45u1Dx3xaOcMPe4U9IVEeabF4U4GVo4oc\nikxK6lj/tPAcUX9SnvZb+mydTfNQGsTsgd1aV+UIaDyw8s5UJtAxMVeXwpOpWypD\nDwwZDAPeZa6+Ra+zp5WFKxBSA3FJs1/sW3LQ45jozLNnhmpc4/DJwLQOb31ETFDy\nNMGOJJ4Z4qO+1fNbOF7BZmXk6WD77I2qdegojA6wEqXJycuMVjvPO4ZJZlr7t7tU\ngCT4dGdoS2BmrZfNxYJ/l6ti/ghEJuX3dszRmPSEuMbKkoPi5zYVM5/N06ZY7E9/\n65UlWt+Ns5Uu0299XcThacDduQSGUUEd/pYs4QYbGQKBgQDGi/FIIKxJ/MRWYqlt\n2AoXmjq/b05T9dsPo/92LuD38NBbKvPwiZxCKy3hxPO/JFaeKKLDXrdH5MRWIaOb\nEsRASe0JSdb29cr1n/Kv2fDh5Z3xanLxKWQjZuqRDL+6yIovtU0bYmf3Qedi3b7i\nBVWLeYUAvUoLEAUCMJ3owS3DWQKBgQC75OFmcCBSTwxALt2CV0b9Tpix3Gt5O2qS\nj+lCS6Ow2QIZdR0L1BSGpRgrO3KbRXpKSuRddOa4OrsFQ3wbqGQPnqemsETC0nsU\nsBUvOmvV9BRkPGLcxJEaAhto9MBdz3PZuldDJsXdSJKjP6fVQ6QR8N9gp5SGFf2q\nLdDsg+9pMwKBgEEfdayqytgZyGxtQBV/XxAOzmYsJAz1/zxKFmi1R6ULn8vHcuva\ntx4c+5ep+ikfyilmOrzKPGOgbaWysu8SYLyVguIhDhlC1adrJzb2zUPLBNtChyEC\n6o2SHC4neFvTmz+6v+fThzZar4KGKS4Jgd2VpkJv0/F896eYOrM1acVBAoGAMYkw\nG4+oFcsdUbaJU5mq75FPFGUmOHn/qNAkEQRcDX3I3elQVRP+rVjNPGiZ2HHCwd9o\nwXLWeO+S6tpV1/zXFH8heAK0viA7rsKVczQVxfxpe9unvMhd8NtpWoxcQt80jcxg\nwSVxuNsvPbbEiqcglFJKsfK8Z3VYwQr/L7vA3J0CgYEAnbHNkLBFTsKssiXw0qjs\n9ARciKpbZLPzxv3nAn/IRcvJHqBzqpuZLFuptZaK6WlPiCDqBqG/QYhSfLGRAFf+\nkxw/3rhDLgzUpzm2RzWkI5vgosgEW14o6pqWwiqjpHVRp0G96i5mMuwhLF/Jlr3/\ndhsqKuYArLQXPdU0qD8TpmU=\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-gai84@bini-83648.iam.gserviceaccount.com',
  client_id: '110953540001347434792',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gai84%40bini-83648.iam.gserviceaccount.com',
};

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: 'https://bini-83648.firebaseio.com',
});
module.exports = { firebaseAdmin: admin };
