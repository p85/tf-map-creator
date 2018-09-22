
class MapEditor {
    constructor() {
        this.sprites = []; // {name, data, meta}
        this.tiletypes = [{ id: -1, name: 'floor' }, { id: -3, name: 'ammo' }, { id: -4, name: 'armor' }, { id: -5, name: 'health' }, { id: -6, name: 'player' }];
        this.walls = []; // {id, name, data}
        this.selectedWallId;
        this.selectedTile; // {id, color}
        this.mapdata = []; // {id, idtilelist, x, y}
        this.tilelist = []; // {id, name}
        this.mapname = '';
        this.started = false;
        this.wallnr = 1;
    }

    refreshTileList() {
        this.tilelist = [...this.tiletypes];
        this.walls.forEach(wall => {
            this.tilelist.push({ id: wall.id, name: wall.name });
        })
        const tilemenu = document.getElementById('tilemenu');
        tilemenu.innerHTML = '';
        this.tilelist.forEach(tile => {
            const newEntry = document.createElement('li');
            const dummyLink = document.createElement('a');
            const text = document.createTextNode(tile.name);
            dummyLink.appendChild(text);
            newEntry.appendChild(dummyLink);
            newEntry.setAttribute('onClick', 'instance.selectTile(' + tile.id + ')');
            tilemenu.appendChild(newEntry);
        });

    }

    paintTile(x, y) {
        if (!this.selectedTile) {
            alert('Please select a Tile First');
            return;
        }
        let exists = false;
        this.mapdata.forEach(md => {
            if (md.x == x && md.y == y) {
                md.idtilelist = this.selectedTile.id;
                exists = true;
            }
        })
        if (!exists) {
            this.mapdata.push({ id: + new Date(), idtilelist: this.selectedTile.id, x: x, y: y });
        }
        document.getElementById(x + ',' + y).style.backgroundColor = this.selectedTile.color;
    }

    selectTile(id) {
        switch (id) {
            case -1:
                this.selectedTile = { id: id, color: '#FFFFFF' };
                break;
            case -3:
                this.selectedTile = { id: id, color: '#AEB404' };
                break;
            case -4:
                this.selectedTile = { id: id, color: '#B40404' };
                break;
            case -5:
                this.selectedTile = { id: id, color: '#088A08' };
                break;
            case -6:
                this.selectedTile = { id: id, color: '#045FB4' }
                break;
            default:
                this.selectedTile = { id: id, color: '#000000' }
        }
        document.getElementById('seltile').innerText = 'Selected Tile: ' + this.tilelist.filter(tl => tl.id == id)[0].name;
    }

    loadDefaultSprites() {
        const ammo = { name: 'ammo', data: sprite_ammo, meta: sprite_ammo_meta };
        const armor = { name: 'armor', data: sprite_armor, meta: sprite_armor_meta };
        const health = { name: 'health', data: sprite_health, meta: sprite_health_meta };
        const player = { name: 'player', data: sprite_player, meta: sprite_player_meta };
        this.sprites = [ammo, armor, health, player];
        this.sprites.forEach(sprite => {
            document.getElementById('sprite' + sprite.name).value = sprite.data;
            if (sprite.name === 'player') {
                document.getElementById('sprite' + sprite.name + 'trans').value = sprite.meta.trans;
            } else {
                document.getElementById('sprite' + sprite.name + 'xscale').value = sprite.meta.xscale;
                document.getElementById('sprite' + sprite.name + 'yscale').value = sprite.meta.yscale;
                document.getElementById('sprite' + sprite.name + 'voffset').value = sprite.meta.voffset;
                document.getElementById('sprite' + sprite.name + 'value').value = sprite.meta.value;
                document.getElementById('sprite' + sprite.name + 'respawn').value = sprite.meta.respawn;
            }
        });
    }

    initEmptyMap() {
        for (let i = 0; i < this.size; i++) {
            for (let ii = 0; ii < this.size; ii++) {
                this.mapdata.push({ id: + new Date() + (Math.trunc(Math.random() * 100000000)), idtilelist: -1, x: ii, y: i });
            }
        }
    }

    changeMapSize(newSize) {
        this.started = true;
        document.getElementById('walledit').setAttribute('class', 'invisible');
        this.mapname = document.getElementById('mapname').value;
        if (!this.mapname) {
            alert('Please specify a Mapname');
            return;
        }
        this.size = newSize;
        this.walls = [];
        this.mapdata = [];
        this.sprites = [];
        this.wallnr = 1;
        this.refreshWallList();
        this.refreshTileList();
        this.initEmptyMap();
        document.getElementById('seltile').innerText = '';
        this.selectedTile = null;
        document.getElementById('walleditname').value = '';
        document.getElementById('walleditdata').value = '';
        const tablearea = document.getElementById('maparea');
        tablearea.innerHTML = '';
        const table = document.createElement('table');
        table.setAttribute('id', 'mapgrid');
        for (var i = 0; i < this.size; i++) {
            const tr = document.createElement('tr');
            for (var ii = 0; ii < this.size; ii++) {
                const td = document.createElement('td');
                td.setAttribute('onClick', 'instance.paintTile(' + ii + ', ' + i + ')');
                td.setAttribute('id', ii + ',' + i);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        tablearea.appendChild(table);
        this.loadDefaultSprites();
    }

    createNewWall() {
        document.getElementById('walledit').setAttribute('class', 'visible');
        const newWall = {
            id: this.wallnr,
            name: 'New Wall ' + (this.walls.length + 1),
            data: '',
        };
        this.wallnr += 1;
        this.walls.push(newWall);
        this.refreshWallList();
        this.selectWall(newWall.id);
        this.refreshTileList();
    }

    refreshWallList() {
        const wallmenu = document.getElementById('wallmenu');
        wallmenu.innerHTML = '';
        this.walls.forEach(wall => {
            const newEntry = document.createElement('li');
            const dummyLink = document.createElement('a');
            const text = document.createTextNode(wall.name);
            dummyLink.appendChild(text);
            newEntry.appendChild(dummyLink);
            newEntry.setAttribute('onClick', 'instance.selectWall("' + wall.id + '")');
            wallmenu.appendChild(newEntry);
        });
    }

    selectWall(id) {
        this.selectedWallId = id;
        const walls = this.walls.filter(w => w.id == id);
        if (walls.length > 0) {
            document.getElementById('walleditname').value = walls[0].name;
            document.getElementById('walleditdata').value = walls[0].data;
        }
    }

    saveWall() {
        const wallname = document.getElementById('walleditname').value;
        const walldata = document.getElementById('walleditdata').value;
        for (var i in this.walls) {
            if (this.walls[i].id == this.selectedWallId) {
                this.walls[i].name = wallname;
                this.walls[i].data = walldata;
                break;
            }
        }
        this.refreshWallList();
        this.refreshTileList();
    }

    // *----*

    compile() {
        if (!this.started) {
            alert('Please create a Map First');
            return;
        }
        if (this.walls.length == 0) {
            alert('You have to define at least one Wall and create the Boundaries');
            return;
        }
        let zip = new JSZip();
        let mapdatafile = '';
        let mapmetafile = '';
        let wallfiles = []; // {filename: 1.data, data}
        let ammospritefile = '';
        let ammometafile = '';
        let armorspritefile = '';
        let armormetafile = '';
        let healthspritefile = '';
        let healthmetafile = '';
        let playerspritefile = '';
        let playermetafile = '';
        this.mapdata.forEach(md => {
            if (md.idtilelist == -1) {
                const tilenr = Math.abs(md.idtilelist + 1);
                mapdatafile += tilenr;
                if (md.x + 1 != this.size) {
                    mapdatafile += ','
                } else {
                    mapdatafile += '\n';
                }
            } else if (md.idtilelist != -3 && md.idtilelist != -4 && md.idtilelist != -5 && md.idtilelist != -6) {
                const tilenr = md.idtilelist;
                mapdatafile += tilenr;
                if (md.x + 1 != this.size) {
                    mapdatafile += ','
                } else {
                    mapdatafile += '\n';
                }
            } else {
                mapdatafile += '0';
                if (md.x + 1 != this.size) {
                    mapdatafile += ','
                } else {
                    mapdatafile += '\n';
                }
            }
        });
        const mapmeta = this.mapdata.filter(md => md.idtilelist <= -3 && md.idtilelist >= -6);
        mapmeta.forEach(mm => {
            let valuename = '';
            switch (mm.idtilelist) {
                case -3:
                    valuename = 'ammo';
                    break;
                case -4:
                    valuename = 'armor';
                    break;
                case -5:
                    valuename = 'health';
                    break;
                case -6:
                    valuename = 'spawn';
                    break;
            }
            mapmetafile += valuename + ',' + mm.x + ',' + mm.y + '\n';
        });
        let wallindex = 1;
        this.walls.forEach(wall => {
            wallfiles.push({ filename: wallindex + '.data', data: wall.data });
            wallindex += 1;
        });
        const ammo = this.getsprite('ammo');
        ammospritefile = ammo.sprite;
        ammometafile = this.createSpriteMetaFile(ammo);
        const armor = this.getsprite('armor');
        armorspritefile = armor.sprite;
        armormetafile = this.createSpriteMetaFile(armor);
        const health = this.getsprite('health');
        healthspritefile = health.sprite;
        healthmetafile = this.createSpriteMetaFile(health);
        const player = this.getsprite('player');
        playerspritefile = player.sprite;
        playermetafile = this.createSpriteMetaFile(player, true);
        zip.file(this.mapname + '/' + this.mapname + '.data', mapdatafile);
        zip.file(this.mapname + '/' + this.mapname + '.meta', mapmetafile);
        console.log(wallfiles);
        wallfiles.forEach(wallfile => {
            zip.file(this.mapname + '/walls/' + wallfile.filename, wallfile.data);
        });
        zip.file(this.mapname + '/sprites/ammo.data', ammospritefile);
        zip.file(this.mapname + '/sprites/ammo.meta', ammometafile);
        zip.file(this.mapname + '/sprites/armor.data', armorspritefile);
        zip.file(this.mapname + '/sprites/armor.meta', armormetafile);
        zip.file(this.mapname + '/sprites/health.data', healthspritefile);
        zip.file(this.mapname + '/sprites/health.meta', healthmetafile);
        zip.file(this.mapname + '/sprites/player.data', playerspritefile);
        zip.file(this.mapname + '/sprites/player.meta', playermetafile);
        zip.generateAsync({ type: 'base64' })
            .then(base64 => {
                window.location = 'data:application/zip;base64,' + base64;
            }, error => {
                alert(error);
            });
    }

    getsprite(name) {
        if (name != 'player') {
            return {
                sprite: document.getElementById('sprite' + name).value,
                xscale: document.getElementById('sprite' + name + 'xscale').value,
                yscale: document.getElementById('sprite' + name + 'yscale').value,
                voffset: document.getElementById('sprite' + name + 'voffset').value,
                value: document.getElementById('sprite' + name + 'value').value,
                respawn: document.getElementById('sprite' + name + 'respawn').value
            };
        } else {
            return {
                sprite: document.getElementById('sprite' + name).value,
                trans: document.getElementById('sprite' + name + 'trans').value
            }
        }
    }

    createSpriteMetaFile(metaobj, isPlayer) {
        let returnthis = '';
        if (isPlayer) {
            returnthis += 'trans,' + metaobj.trans + '\n';
        } else {
            returnthis += 'xscale,' + metaobj.xscale + '\n';
            returnthis += 'yscale,' + metaobj.yscale + '\n';
            returnthis += 'voffset,' + metaobj.voffset + '\n';
            returnthis += 'value,' + metaobj.value + '\n';
            returnthis += 'respawn,' + metaobj.respawn + '\n';
        }
        return returnthis;
    }
}

const instance = new MapEditor();