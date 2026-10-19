const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static('public'));
const rooms = new Map();
const themes = ['Enchanted Garden','Cyber Pop','Royal Ball','Dark Academia','Y2K Superstar','Cloud Nine'];
function code(){return crypto.randomBytes(3).toString('hex').toUpperCase();}
function roomFor(socket){return rooms.get(socket.data.roomCode);}
function publicPlayers(room){return [...room.players.values()].map(p=>({id:p.id,name:p.name,locked:p.locked,score:p.score}));}
function broadcastPlayers(code){const r=rooms.get(code);if(r)io.to(code).emit('players',publicPlayers(r));}
function broadcastOutfits(code){const r=rooms.get(code);if(r)io.to(code).emit('outfits',[...r.players.values()].map(p=>({id:p.id,name:p.name,locked:p.locked,outfit:p.outfit})));}
io.on('connection',socket=>{
 socket.on('createRoom',({name})=>{
   if(socket.data.roomCode) leave(socket);
   let c=code();while(rooms.has(c))c=code();
   const room={players:new Map(),theme:themes[Math.floor(Math.random()*themes.length)]};
   rooms.set(c,room);socket.join(c);socket.data.roomCode=c;
   room.players.set(socket.id,{id:socket.id,name:String(name||'Fashion Icon').slice(0,18),locked:false,score:0,outfit:null});
   socket.emit('roomCreated',{code:c,players:publicPlayers(room)});socket.emit('theme',room.theme);
   io.to(c).emit('feed',(room.players.get(socket.id).name)+' created the room.');broadcastPlayers(c);
 });
 socket.on('joinRoom',({code,name})=>{
   const c=String(code||'').toUpperCase().slice(0,6),room=rooms.get(c);
   if(!room){socket.emit('errorMessage','That room code was not found. Check the code and try again.');return;}
   if(socket.data.roomCode)leave(socket);
   if(room.players.size>=8){socket.emit('errorMessage','This room is full (8 players max).');return;}
   socket.join(c);socket.data.roomCode=c;
   room.players.set(socket.id,{id:socket.id,name:String(name||'Fashion Icon').slice(0,18),locked:false,score:0,outfit:null});
   socket.emit('roomJoined',{code:c,players:publicPlayers(room)});io.to(c).emit('theme',room.theme);
   io.to(c).emit('feed',String(name||'A player')+' joined the runway.');broadcastPlayers(c);
 });
 socket.on('outfit',data=>{const r=roomFor(socket);if(!r)return;const p=r.players.get(socket.id);if(p){p.outfit=data;p.locked=!!data.locked;broadcastOutfits(socket.data.roomCode);}});
 socket.on('lockLook',()=>{const r=roomFor(socket);if(!r)return;const p=r.players.get(socket.id);if(p){p.locked=true;io.to(socket.data.roomCode).emit('feed',p.name+' locked their look.');broadcastPlayers(socket.data.roomCode);broadcastOutfits(socket.data.roomCode);}});
 socket.on('vote',({targetId,score})=>{const r=roomFor(socket);if(!r)return;const p=r.players.get(targetId);if(!p||targetId===socket.id)return;const n=Math.max(1,Math.min(10,Math.round(Number(score)||5)));p.score+=n;io.to(socket.data.roomCode).emit('feed','A runway vote was submitted.');io.to(socket.data.roomCode).emit('scores',publicPlayers(r));});
 socket.on('leaveRoom',()=>leave(socket));
 function leave(s){const c=s.data.roomCode;if(!c)return;const r=rooms.get(c);s.leave(c);delete s.data.roomCode;if(r){const p=r.players.get(s.id);r.players.delete(s.id);if(p)io.to(c).emit('feed',p.name+' left the room.');if(!r.players.size)rooms.delete(c);else broadcastPlayers(c);}}
 socket.on('disconnect',()=>leave(socket));
});
const PORT=process.env.PORT||3000;
server.listen(PORT,'0.0.0.0',()=>console.log(`Runway Rush running at http://localhost:${PORT}`));
