const compileUtil ={
    getVal(expr,vm){
        // [person,name]
        return expr.split('.').reduce((data,currentVal)=>{
            // console.log(currentVal);
            return data[currentVal];
        },vm,$date)
    },
    text(node,expr,vm){ //expr:msg 学习MVM原理 //<div v-text = 'person.fav'></div>
        if(expr.indexOf('{{') !== -1){
            // {{personalbar.name}}--{{personalbar.age}}
            value = expr.replace(/\{\{(.+?)\}\}/g,(...arg)=>{
                return this.getVal(args[1],vm);
            })
        }else{

        value = this.getVal(expr,vm)
    }
        const value = this.getVal(expr,vm);
        this.updater.textUpdate(node,value)
    },
    html(){
        let value;
        let value = this.getVal(expr,vm);
        this.updater.htmlUpdater(node,value);
    },
    model(node,expr,vm){
        const value = this.getVal(expr,vm);
        this.updater.modelUpdater(node,value);
    },
    on(node,expr,vm,eventName){
        let fn = vm.$options.methods && vm.$options.methods[expr];
        node.addEventListener(eventName,fn.bind(vm),false);
    },
    bind(node,expr,vm,attrName){
        // 自己实现
    },
    // 更新的函数
    updater:{
        htmlUpdater(node,value){
            node.innerHTML = value;
        },
        modelUpdater(node,value){
            node.value = value;
        },
        textUpdate(node,value){
            node.textContent = value;
        }
    }
}
class Compile{
    constructor(el,vm){
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        // console.log(this.el);
        this.vm = vm;
        // 1.获取文档碎片对象 放入内存中会减少页面的回流和重绘
        const fragment = this.node2Fragment(this.el);
        // console.log(fragment);

        // 2.编译模板
        this.compile(fragment);

        // 3.追加子元素到根元素
        this.el.appendChild(fragment);
    }
    /*
        <h2>{{person.name}} -- {{person.age}}</h2>
        <h3>{{person.fav}}</h3>
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
        </ul>
        <h3>{{msg}}</h3>
        <div v-test = 'msg'></div>
        <div v-html = 'htmlStr'></div>
        <input type="text" v-model='msg'>

    */
    compile(fragment){
        // 1.获取子节点
        const childNodes = fragment.childNodes;
        [...childNodes].forEach(child=>{
            // console.log(child);
            if(this.isElementNode(child)){
                // 是元素节点
                // 编译元素节点
                // console.log('元素节点'.child);
                this.compileElement(child);
            }else{
                // 文本节点
                // 编译文本节点
                // console.log('文本节点',child);
                this.compileText(child);
            }

            if(child.childNodes && child.childNodes.length){
                this.compile(child);
            }
        })
    }
    compileElement(node){
        //   console.log(node)
        // <div v-text="msg"></div>
        const attributes = node.attributes;
        [...attributes].forEach(attr=>{
            const{name,value} = attr;
            console.log(attr);
            if(this.isDirective(name)){//是一个指令 v-text v-html v-model v-on:click v-bind:src
                const[,dirctive] = name.split('-'); //text html model on:click
                const[dirName,eventName] = dirctive.split(':');//text html model on
                // 更新数据 数据驱动视图
                compileUtil[dirname](node,value,this.vm,eventName)

                // 删除有指令的标签上的属性
                node.removeAttribute('v-' + dirctive);
            }else if(this.isEventName(name)){ //@click="handleClick"
                let [,eventName] = name.split('@');
                compileUtil['on'](node,value,this.vm,eventName);
            }
            
        })
    }
    compileText(node){
        // {()} v-text
        const content = node.textContent;

        if(/\{\{(.+?)\}\}/.test(content)){
            compileUtil['text'](node,content,this.vm);
        }
    }
    isDirective(attrName){
        return attrName.startsWith('v-')
    }
    node2Fragment(el){
        // 创建文档碎片
        const f = document.createDocumentFragment();
        let firstChild;
        while(firstChild = el.firstChild){
            f.appendChild(firstChild);
        }
        return f;
    }
    isElementNode(node){
        return node.nodeType === 1;
    }
}
class MVue{
    constructor(options){
        this.$el = options.el;
        this.$data = options.data;
        this.$options = options;
        if(this.$el){
            // 1.实现一个数据观察者
            // 2.实现一个指令解析器
            new Compile(this.$el,this);
        }
    }
}