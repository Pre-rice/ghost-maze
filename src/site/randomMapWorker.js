import '../vendor/pako.js';
import {generateFullMaze} from '../core/mazeGenerator.js';
import {DataSerializer} from '../core/dataSerializer.js';

globalThis.window={pako:globalThis.pako};
self.onmessage=({data:{size,health}})=>{
    try {
        if(!Number.isInteger(size)||size<8||size>20||!Number.isInteger(health)||health<1||health>0xffffffff)throw new Error('地图大小或初始生命无效');
        const map={...generateFullMaze(size,size),gameMode:'exploration',initialHealth:health};
        self.postMessage(DataSerializer.generateShareCode(map));
    } catch(error) {self.postMessage({success:false,error:error.message});}
};
