import { fromBase64, unpack, shortestCode } from '../core/binaryCodec.js';

const LIMIT = 1024 * 1024;
const integer = (n, min, max) => Number.isInteger(n) && n >= min && n <= max;
export function validateDraft(snapshot) {
    const m = snapshot?.map, f = snapshot?.frame;
    if (!m || !integer(m.width,8,20) || !integer(m.height,8,20) || !Array.isArray(m.layers) || !integer(m.layers.length,1,10)) throw new Error('草稿范围无效');
    if (!f || !integer(f.x,0,19) || !integer(f.y,0,19) || !integer(f.width,1,20) || !integer(f.height,1,20) || f.x+f.width>20 || f.y+f.height>20 || !integer(snapshot.layer,0,m.layers.length-1)) throw new Error('草稿编辑区域无效');
    if(!['regular','free'].includes(m.editorMode)||!['exploration','death-loop'].includes(m.gameMode)||!integer(m.initialHealth,1,0xffffffff)||m.layerCount!==m.layers.length||m.multiLayerMode!==(m.layers.length>1))throw new Error('草稿模式或层数无效');
    const direction=d=>d&&integer(d.dx,-1,1)&&integer(d.dy,-1,1)&&Math.abs(d.dx)+Math.abs(d.dy)===1;
    const point = p => p && integer(p.x,0,m.width-1) && integer(p.y,0,m.height-1);
    for (const layer of m.layers) {
        if (!Array.isArray(layer.activeCells) || layer.activeCells.length!==m.height || layer.activeCells.some(r=>!Array.isArray(r)||r.length!==m.width||r.some(v=>typeof v!=='boolean'))) throw new Error('草稿地板无效');
        for (const [key,h,w] of [['hWalls',m.height+1,m.width],['vWalls',m.height,m.width+1]]) {
            const rows=layer[key];
            if (!Array.isArray(rows)||rows.length!==h||rows.some(r=>!Array.isArray(r)||r.length!==w||r.some(v=>!v||!integer(v.type,0,6)))) throw new Error('草稿墙体无效');
        }
        for(const rows of [layer.hWalls,layer.vWalls])for(const row of rows)for(const wall of row){if(wall.type===3&&!integer(wall.keys,0,0xffffffff)||wall.type===4&&!direction(wall.direction)||wall.type===6&&(!/^[A-Z]$/.test(wall.letter)||!['open','closed'].includes(wall.initialState)))throw new Error('草稿门参数无效');}
        if(!Array.isArray(layer.buttons)||layer.buttons.some(b=>!/^[A-Z]$/.test(b.letter)||!direction(b.direction)))throw new Error('草稿按钮参数无效');
        for (const key of ['ghosts','items','buttons']) if(!Array.isArray(layer[key])||layer[key].some(p=>!point(p))) throw new Error('草稿元件位置无效');
        for (const p of [layer.customStartPos,layer.endPos]) if(p && !point(p))throw new Error('草稿起终点无效');
    }
    if (!Array.isArray(m.stairs) || m.stairs.some(s=>!point(s)||!integer(s.layer,0,m.layers.length-1)||!['up','down'].includes(s.direction))) throw new Error('草稿楼梯无效');
    return { map:structuredClone(m),frame:{...f},layer:snapshot.layer,originalCode:null };
}
export function encodeDraft(snapshot) {
    try {
        const checked=validateDraft(snapshot);
        const bytes=new TextEncoder().encode(JSON.stringify({map:checked.map,frame:checked.frame,layer:checked.layer}));
        if(bytes.length>LIMIT)throw new Error('草稿过大');
        const code=shortestCode([{bytes,control:0}],control=>Uint8Array.of(control));
        const back=decodeDraft(code);
        if(!back.success||JSON.stringify(back.snapshot)!==JSON.stringify(checked))throw new Error('草稿链接核验失败');
        return {success:true,code};
    } catch(error) { return {success:false,error:error.message}; }
}
export function decodeDraft(code) {
    try {
        const bytes=fromBase64(code);
        if(bytes.length<2||bytes.length>LIMIT||bytes[0]>1)throw new Error('草稿链接无效');
        const raw=unpack(bytes.subarray(1),bytes[0]&1,LIMIT);
        const snapshot=validateDraft(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(raw)));
        return {success:true,snapshot};
    } catch(error) { return {success:false,error:'草稿链接无效：'+error.message}; }
}
