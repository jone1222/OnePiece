/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var VSHADER_SOURCE = //  Vertex Shader
    'attribute vec4 a_Position; \n' +
    'attribute vec4 a_Color; \n' +
    'attribute vec2 a_texCoord; \n' +
    'uniform vec3 u_Pos; \n' +
    'uniform vec3 u_Move; \n' +
    'uniform mat4 u_Trans; \n' +
    'varying vec4 v_Color; \n' +
    'varying vec2 v_texCoord; \n' +
    'void main(){ \n' +
    '   vec4 newPos =vec4(0.5*a_Position.xyz, a_Position.w); \n' + //  gl_Position : 4차원 float 벡터 타입
    '   newPos.xyz= newPos.xyz +u_Pos +u_Move; \n' +
    '   gl_Position = u_Trans * newPos; \n' +
    '   v_Color = a_Color; \n' +
    '   v_texCoord = a_texCoord; \n' +
    '} \n';

var FSHADER_SOURCE =
    'precision mediump float; \n' +
    'uniform sampler2D u_Sampler; \n' +
    'varying vec4 v_Color; \n' +
    'varying vec2 v_texCoord; \n' +
    'void main(){ \n' +
    '   gl_FragColor = texture2D(u_Sampler, v_texCoord); \n' +
    //'   gl_FragColor = v_Color; \n' +  //  gl_FragColor : 4차원 float 벡터 타입
    '} \n';

var vertices = [// Coordinates
    1.0, 1.0, 1.0, 1, 0, 0, 1,
    -1.0, 1.0, 1.0, 1, 0, 0, 1,
    -1.0, -1.0, 1.0, 1, 0, 0, 1,
    1.0, -1.0, 1.0, 1, 0, 0, 1, // v0-v1-v2-v3 front
    1.0, 1.0, 1.0, 0, 1, 0, 1,
    1.0, -1.0, 1.0, 0, 1, 0, 1,
    1.0, -1.0, -1.0, 0, 1, 0, 1,
    1.0, 1.0, -1.0, 0, 1, 0, 1, // v0-v3-v4-v5 right
    1.0, 1.0, 1.0, 0, 0, 1, 1,
    1.0, 1.0, -1.0, 0, 0, 1, 1,
    -1.0, 1.0, -1.0, 0, 0, 1, 1,
    -1.0, 1.0, 1.0, 0, 0, 1, 1, // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0, 1, 1, 0, 1,
    -1.0, 1.0, -1.0, 1, 1, 0, 1,
    -1.0, -1.0, -1.0, 1, 1, 0, 1,
    -1.0, -1.0, 1.0, 1, 1, 0, 1, // v1-v6-v7-v2 left
    -1.0, -1.0, -1.0, 1, 0, 1, 1,
    1.0, -1.0, -1.0, 1, 0, 1, 1,
    1.0, -1.0, 1.0, 1, 0, 1, 1,
    -1.0, -1.0, 1.0, 1, 0, 1, 1, // v7-v4-v3-v2 down
    1.0, -1.0, -1.0, 0, 1, 1, 1,
    -1.0, -1.0, -1.0, 0, 1, 1, 1,
    -1.0, 1.0, -1.0, 0, 1, 1, 1,
    1.0, 1.0, -1.0, 0, 1, 1, 1   // v4-v7-v6-v5 back
];

var indices = [
    0, 1, 2, 0, 2, 3, // front
    4, 5, 6, 4, 6, 7, // right
    8, 9, 10, 8, 10, 11, // up
    12, 13, 14, 12, 14, 15, // left
    16, 17, 18, 16, 18, 19, // down
    20, 21, 22, 20, 22, 23     // back
];

var textureCoordinates = [
    // 앞
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    // 뒤
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    // 위
    0.0, 0.0,
    0.0, 0.0,
    0.0, 0.0,
    0.0, 0.0,
    // 오른쪽
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    // 아래
    0.0, 0.0,
    0.0, 0.0,
    0.0, 0.0,
    0.0, 0.0,
    // 왼쪽
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0
];

var matrix = new Matrix4();
matrix.setIdentity();
matrix.scale(0.8, 0.4, 0.4);
matrix.translate(0, -0.9, 0);

var locationT = {};
locationT.x = 0.0;
locationT.y = 0.0;

var Status = function () {
    this.cakeLayers = [];
    this.colorChoose = -1;
    this.typeChoose = -1;
};

Status.prototype.copyStatus = function (target) {
    this.cakeLayers.length = 0;

    for (var i = 0; i < target.cakeLayers.length; i++) {
        var tempCake = new CakeLayer(-1, -1);
        tempCake.color = target.cakeLayers[i].color;
        tempCake.type = target.cakeLayers[i].type;
        switch (tempCake.color) {
            case -1 :
                Cakecolor = [1.0, 1.0, 1.0, 1.0];
                break;
            case "red" :
                Cakecolor = [1.0, 0.0, 0.0, 1.0];
                break;
            case "pink" :
                Cakecolor = [1.0, 0.0, 1.0, 1.0];
                break;
            case "orange" :
                Cakecolor = [1.0, 0.5, 0.0, 1.0];
                break;
        }
        for (var j = 0; j < 24; j++) {
            tempCake.vertice[ j * 7 + 3 ] = Cakecolor[0];
            tempCake.vertice[ j * 7 + 4 ] = Cakecolor[1];
            tempCake.vertice[ j * 7 + 5 ] = Cakecolor[2];
            tempCake.vertice[ j * 7 + 6 ] = Cakecolor[3];
        }
        this.cakeLayers.push(tempCake);
    }
    this.colorChoose = target.colorChoose;
    this.typeChoose = target.typeChoose;
};

var befStatus = new Status();
var historyStatus = [new Status()];
var curStatus = historyStatus[ 0 ];

var CakeLayer = function (type, color) {
    this.type = type;
    this.vertice = vertices.slice(0);
    this.color = color; //default value when color has not been set
};

CakeLayer.prototype.changeColor = function (targetColor, targetVertice) {
    switch (targetColor) {
        case -1 :
            Cakecolor = [1.0, 1.0, 1.0, 1.0];
            break;
        case "red" :
            Cakecolor = [1.0, 0.0, 0.0, 1.0];
            break;
        case "pink" :
            Cakecolor = [1.0, 0.0, 1.0, 1.0];
            break;
        case "orange" :
            Cakecolor = [1.0, 0.5, 0.0, 1.0];
            break;
    }
    for (var i = 0; i < 24; i++) {
        targetVertice[ i * 7 + 3 ] = Cakecolor[0];
        targetVertice[ i * 7 + 4 ] = Cakecolor[1];
        targetVertice[ i * 7 + 5 ] = Cakecolor[2];
        targetVertice[ i * 7 + 6 ] = Cakecolor[3];
    }
};

CakeLayer.prototype.changeType = function (layerType, receivedType) {
    layerType = receivedType;
};

var Caketype = -1;
var Cakecolor = [1.0, 1.0, 1.0, 1.0];

var UpdateType = function (type) {
    switch (type.value) {
        case -1 :
            Caketype = -1;
            break;
        case "type1" :
            Caketype = 1;
            break;
        case "type2" :
            Caketype = 2;
            break;
        case "type3" :
            Caketype = 3;
            break;
    }
};

var UpdateColor = function (color) {
    curStatus.colorChoose = color.value;
    switch (color.value) {
        case -1 :
            Cakecolor = [1.0, 1.0, 1.0, 1.0];
            break;
        case "red" :
            Cakecolor = [1.0, 0.0, 0.0, 1.0];
            break;
        case "pink" :
            Cakecolor = [1.0, 0.0, 1.0, 1.0];
            break;
        case "orange" :
            Cakecolor = [1.0, 0.5, 0.0, 1.0];
            break;
    }
    for (var i = 0; i < 24; i++) {
        vertices[ i * 7 + 3 ] = Cakecolor[0];
        vertices[ i * 7 + 4 ] = Cakecolor[1];
        vertices[ i * 7 + 5 ] = Cakecolor[2];
        vertices[ i * 7 + 6 ] = Cakecolor[3];
    }
    update_count++;
};

var UpdateStatus = function () {
    var newStatus = new Status();
    newStatus.copyStatus(curStatus);
    historyStatus.push(newStatus);
    curStatus = historyStatus[historyStatus.length - 1];

    var select = document.getElementById('editLayer');

    var sample = '';

    switch (curStatus.colorChoose) {
        case -1 :
            sample = '';
            break;
        case "red" :
            sample = 'sample1.png';
            break;
        case "pink" :
            sample = 'sample2.png';
            break;
        case "orange" :
            sample = 'sample3.png';
            break;
    }

    if (selectedLayer === -1) {
        alert("Appropriate Layer has to be chosen!!");
    } else {
        curStatus.cakeLayers[selectedLayer - 1].color = curStatus.colorChoose;
        var selectedId = selectedLayer - 1;
        var optionOld = document.getElementById(selectedId);

        var option = document.createElement('input');
        option.type = "image";
        option.setAttribute("style", "background-image:url(" + sample + ");");
        option.id = selectedLayer - 1;
        option.value = selectedLayer;
        option.setAttribute("class", "exampleImage");
        option.text = "Layer" + (curStatus.cakeLayers.length);
        option.setAttribute("onclick", "editLayer(this)");
        select.replaceChild(option, optionOld);

        switch (curStatus.cakeLayers[selectedLayer - 1].color) {
            case -1 :
                Cakecolor = [1.0, 1.0, 1.0, 1.0];
                break;
            case "red" :
                Cakecolor = [1.0, 0.0, 0.0, 1.0];
                break;
            case "pink" :
                Cakecolor = [1.0, 0.0, 1.0, 1.0];
                break;
            case "orange" :
                Cakecolor = [1.0, 0.5, 0.0, 1.0];
                break;
        }
        for (var i = 0; i < 24; i++) {
            curStatus.cakeLayers[selectedLayer - 1].vertice[ i * 7 + 3 ] = Cakecolor[0];
            curStatus.cakeLayers[selectedLayer - 1].vertice[ i * 7 + 4 ] = Cakecolor[1];
            curStatus.cakeLayers[selectedLayer - 1].vertice[ i * 7 + 5 ] = Cakecolor[2];
            curStatus.cakeLayers[selectedLayer - 1].vertice[ i * 7 + 6 ] = Cakecolor[3];
        }
        DrawStatus();
    }
};

var textureSet = [];

var DrawStatus = function () {
    var canvas = document.getElementById('gpudraw');
    var gl = canvas.getContext('webgl');

    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

    if (!gl) {
        console.log('Failed to get webgl');
        return;
    }

    var vbo = gl.createBuffer();
    if (!vbo) {
        console.log('Failed to create buffer');
    }

    var veo = gl.createBuffer();
    if (!veo) {
        console.log('Failed to create buffer');
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    var posLoc = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 4 * 7, 0);  //  x,y,z,r,g,b,a
    gl.enableVertexAttribArray(posLoc);

    var colLoc = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(colLoc, 4, gl.FLOAT, false, 4 * 7, 4 * 3);
    gl.enableVertexAttribArray(colLoc);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, veo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var uPosLoc = gl.getUniformLocation(gl.program, 'u_Pos');
    gl.uniform3f(uPosLoc, 0.0, 0.0, 0.0);

    var texture = gl.createTexture();
    var u_Sampler = gl.getUniformLocation(gl.program, image);

    switch (curStatus.colorChoose) {
        case -1 :
            image.src = '';
            break;
        case "red" :
            image.src = 'sample1.png';
            break;
        case "pink" :
            image.src = 'sample2.png';
            break;
        case "orange" :
            image.src = 'sample3.png';
            break;
    }
    loadTexture(gl, 0, texture, u_Sampler, image);

    var repeat = function () {
        update();
        rotatedraw(gl, vbo, veo);
        requestAnimationFrame(repeat);
    };

    repeat();

};
var update_count = 0;
var image = new Image();
var update = function () {
    matrix.rotate(1, 0, 1, 0);
};

function rotatedraw(gl, bufferID, elementID) {
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
    var posLoc = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 4 * 7, 0);  //  x,y,z,r,g,b,a
    gl.enableVertexAttribArray(posLoc);

    var colLoc = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(colLoc, 4, gl.FLOAT, false, 4 * 7, 4 * 3);
    gl.enableVertexAttribArray(colLoc);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementID);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    var u_MoveLoc = gl.getUniformLocation(gl.program, 'u_Move');

    var u_TransLoc = gl.getUniformLocation(gl.program, 'u_Trans');
    gl.uniformMatrix4fv(u_TransLoc, false, matrix.elements);

    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (var i = 0; i < curStatus.cakeLayers.length; i++) {

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(curStatus.cakeLayers[i].vertice), gl.STATIC_DRAW);
        var uPosLoc = gl.getUniformLocation(gl.program, 'u_Pos');
        gl.uniform3f(u_MoveLoc, 0.0, 0.0, 0.0);
        gl.uniform3f(uPosLoc, 0.0, i, 0.0);
        drawTexture(gl, image, i);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
}
var count = 0;
var drawTexture = function (gl, image, i) {
    var textureBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
    var texCoord = gl.getAttribLocation(gl.program, 'a_texCoord');
    gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoord);

    gl.bindTexture(gl.TEXTURE_2D, textureSet[i]);
};

var loadTexture = function (gl, n, texture, u_Sampler, image) {
    image.onload = function () {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

        if (selectedLayer === -1) {
            textureSet[count] = texture;
            count++;
        } else {
            textureSet[selectedLayer - 1] = texture;
            selectedLayer = -1;
        }
        gl.uniform1i(u_Sampler, 0);

    };
};

var Layercount = 1;
function AddLayer() {

    var newStatus = new Status();
    newStatus.copyStatus(curStatus);
    historyStatus.push(newStatus);
    curStatus = historyStatus[historyStatus.length - 1];

    Layercount += 1;
    var newType = document.getElementById('selectType');

    var newLayer = new CakeLayer(newType.value, curStatus.colorChoose);

    newLayer.changeColor(newLayer.color, newLayer.vertice);

    curStatus.cakeLayers.push(newLayer);

    var sample = '';

    switch (curStatus.colorChoose) {
        case -1 :
            sample = '';
            break;
        case "red" :
            sample = 'sample1.png';
            break;
        case "pink" :
            sample = 'sample2.png';
            break;
        case "orange" :
            sample = 'sample3.png';
            break;
    }

    var select = document.getElementById('editLayer');
    var option = document.createElement('input');
    option.type = "image";
    option.setAttribute("style", "background-image:url(" + sample + ");");
    option.id = curStatus.cakeLayers.length - 1;
    option.value = curStatus.cakeLayers.length;
    option.setAttribute("class", "exampleImage");
    option.setAttribute("onclick", "editLayer(this)");
    select.appendChild(option);


    DrawStatus();
}
var isEdit = false;

var selectedLayer = -1;

var editLayer = function (obj) {
    selectedLayer = obj.value;
};

var changeMode = function (obj) {
    curStatus = historyStatus[historyStatus.length - 1];

    status.colorChoose = -1;
    var addButton = document.getElementById('all');
    var applyButton = document.getElementById('each');
    var editLayer = document.getElementById('editLayer');

    if (obj.id === "each") {
        isEdit = true;
        editLayer.style.opacity = 1.0;
        editLayer.style.pointerEvents = 'auto';
        applyButton.disabled = 'disabled';
        addButton.removeAttribute('disabled');
        document.getElementById('addLayer').disabled = 'disabled';
        document.getElementById('apply').removeAttribute('disabled');
    } else {
        isEdit = false;
        editLayer.style.pointerEvents = 'none';
        editLayer.style.opacity = 0.5;
        applyButton.removeAttribute('disabled');
        addButton.disabled = 'disabled';
        document.getElementById('apply').disabled = 'disabled';
        document.getElementById('addLayer').removeAttribute('disabled');
    }
};

function popStatus() {
    if (historyStatus.length === 0) {
        alert("History is empty!!");
        return;
    }
    historyStatus.pop();
    curStatus = historyStatus[historyStatus.length - 1];
    var select = document.getElementById('editLayer');
    var latest = document.getElementById(curStatus.cakeLayers.length);
    select.removeChild(latest);
    count--;
}