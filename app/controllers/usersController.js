const db = require("../../models");
const User = db.users;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Tên không được bỏ trống!"
    });
    return;
  }
  const user = {
    email: req.body.email,
    name: req.body.name,
    age: req.body.age
  };

  User.create(user)
    .then(data => {
      res.send({
        message: "Tạo mới thành công!"
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Tạo mới thất bại."
      });
    });
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
