const userRouter = require('./user/user.router');
const rankingRouter = require('./ranking/ranking.router');
const friendRequestRouter = require('./friend_request/friend_request.router');

const router = app => {
  //Rotas do app
  app.use('/user', userRouter);

  app.use('/ranking', rankingRouter);

  app.use('/friendRequest', friendRequestRouter);

  app.use('/', (_, res) => {
    res
      .status(404)
      .send('Página não econtrada, verifique a url e o tipo de requisição');
  });
};

module.exports = router;
