require('./app')(['db'])(({args, rest, url}) => {
  const [db] = args
  rest.get(`${url}/${db}/_changes?since=now&limit=1`)
})
