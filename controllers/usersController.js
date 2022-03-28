const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const authMethod = require('./../auth/authMethods.js');

exports.signup = (req, res) => {
  if (!req.body.email) {
    res.status(400).send({
      message: "Email không được bỏ trống!"
    });
    return;
  }
  let passwordHashed = bcrypt.hashSync(req.body.password, saltRounds);
  let user = {
    email: req.body.email.toLowerCase(),
    password: passwordHashed,
    name: req.body.name,
    age: req.body.age
  };
  const createUser = User.create(user);
  if (!createUser) {
    return res
      .status(400).send({ message: "Đăng ký thất bại" });
  }
  return res.send({ message: "Đăng ký thành công" });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
  User.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Đã có lỗi xảy ra"
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  User.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(500).send({
          message: "Không tìm thấy user"
        });
      }
    })
};

exports.update = (req, res) => {
  const id = req.params.id;
  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Cập nhật thành công."
        });
      } else {
        res.send({
          message: "Cập nhật thất bại"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Đã có lỗi xảy ra"
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Xóa thành công!"
        });
      } else {
        res.send({
          message: "Xóa thất bại"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Đã có lỗi xảy ra"
      });
    });
};

exports.deleteAll = (req, res) => {
  User.destroy({ where: {}, truncate: false })
    .then(nums => res.send({ message: `${nums} users đã được xóa thành công!` }))
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Đã có lỗi xảy ra."
      });
    });
};

exports.logIn = async (req, res) => {
  const email = req.body.email.toLowerCase()
  const password = req.body.password
  let user = await User.findOne({where: { email: email }})
  if (!user) {
		return res.status(401).send('Tài khoản không tồn tại.');
	}
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  console.log(isPasswordValid);
	if (!isPasswordValid) {
		return res.status(401).send('Mật khẩu không chính xác.');
	}
  const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const dataForAccessToken = {
		username: user.username,
	};
	const accessToken = await authMethod.generateToken(
		dataForAccessToken,
		accessTokenSecret,
		accessTokenLife,
	);
	if (!accessToken) {
		return res
			.status(401)
			.send('Đăng nhập không thành công, vui lòng thử lại.');
	}

  return res.json({
		msg: 'Đăng nhập thành công.',
		accessToken,
		user,
	});
}
