require('dotenv').config();
const chavePrivada = process.env.CHAVE_JWT || '';
const jwt = require('jsonwebtoken');

exports.autenticar = (req, res, next) => {
    const token = req.headers['authorization'];

    jwt.verify(token, chavePrivada, (erro, informacoesUsuario) => {
        if(erro)
            return res.status(401).send({ msg: 'Token inválido ou expirado!' });
        next();
    });
}

exports.logar = (req, res, next) => {
    const { usuario, senha } = req.headers;

    const dadosUsuario = buscaDadosUsuario(usuario);
    const senhaValidada = autenticarSenha(senha, dadosUsuario.senha);

    if(senhaValidada) {
        jwt.sign(dadosUsuario, chavePrivada, { expiresIn: '20000' }, (erro, token) => {
            if(erro)
                return res.status(500).send({ msg: 'Erro ao gerar JWT!'});
            res.status(200).send({ token: token });
        });
    } else {
        res.status(401).send({ msg: 'Usuário ou Senha errados!' });
    }
}

async function autenticarSenha(senha, hash) {
    const result = await bcrypt.compare(senha, hash);
    return result
}

async function buscaDadosUsuario(nome){
    const usuario = await Usuario.find({usuario: nome});
    return usuario;
}