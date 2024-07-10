const userRouter = require('./user/user.router');

const router = app => {
  //Rotas do app
  app.use('/user', userRouter);

  app.use('/', (_, res) => {
    res
      .status(404)
      .send('Página não econtrada, verifique a url e o tipo de requisição');
  });
};

export default router;
