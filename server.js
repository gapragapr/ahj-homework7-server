const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaCors = require('koa-cors');
const uuid = require('uuid')

const app = new Koa();

const server = http.createServer(app.callback()).listen(8080);

app.use(koaBody({
    urlencoded: true,
    multipart: true,
    bodyparser: true
}));

app.use(koaCors())

let tickets = [{
    id: uuid.v4(),
    name: 'Поменять краску в принтере, ком. 404',
    description: 'Принтер HP LJ 1210, картриджи на складе',
    status: false,
    created: initDate()
  },
  {
    id: uuid.v4(),
    name: 'Установить обновление КВ-ХХХ',
    description: 'Вышло критическое обновление для Windows',
    status: false,
    created: initDate()
  }];

class TicketFull {
    constructor(name, description) {
      this.id = uuid.v4();
      this.name = name;
      this.description = description;
      this.status = false;
      this.created = initDate();
    }
  }

function initDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear().toString().slice(2);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year} ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

app.use(async (ctx) => {
    const { method, id, status } = ctx.request.query;
    const { editId, name, description } = ctx.request.body;
    let item;

    console.log(ctx.request.query)

    switch (method) {
        case 'allTickets':
            ctx.response.body = tickets;
            return;
        case `ticketById`:
            const ticket = tickets.filter((item) => item.id === id);
            ctx.response.body = ticket[0].description;
            return;
        case 'createTicket':
            const {name, description} = ctx.request.body
            tickets.push(new TicketFull(name, description));
            ctx.response.body = tickets
            return
        // TODO: обработка остальных методов
        default:
            ctx.response.status = 404
            return;
    }
})

