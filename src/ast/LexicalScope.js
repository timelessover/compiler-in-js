let scopeId = 1
class LexicalScope {
  constructor(parent){
    this.parent = parent 
    if(!this.parent){
      this.globalHash = {}
    }
    else {
      this.globalHash = parent.globalHash
      this.parent.add(this)
    }
    this.id = scopeId ++
    this.table = {}
    this.children = []
    this.varId = 0; 
    

  }

  add(subScope) {
    this.children.push(subScope)
  }  

  lookup(id) {
    if(id.indexOf('$') !== -1) {
      return this.globalHash[id]
    }
    let p = this
    while(p) {
      if( p.table[id] ) {
        return p
      }
      p = p.parent
    }
    return null
  }

  bindTempVar(type = 'number'){
    const varName = `$t`+this.varId
    this.bind(varName, type)
    return varName+'@'+this.id
  }

  bind(id, type = 'number') {
    this.globalHash[id+'@'+this.id]=this
    this.table[id] = {
      type,
      varId : this.varId++
    }
  }

  getLexemeName(id){
    const scope = this.lookup(id)
    if(scope) {
      return id+'@'+scope.id
    } else {
      throw `syntax error: lexeme ${id} not found.`
    }
  }

  print(level = 0) {

    const pad = ''.padStart(level * 2)
    console.log(`${pad}scope ${this.id}\n${pad}{`)
    for(let key in this.table) {
      console.log(`${pad}  ${key} : ${this.table[key].type}`)
    }
    this.children.forEach(child => {
      child.print(level + 1)
    })
    console.log(`${pad}}`)
  }

  toJSON(){
    const obj = {
      id:this.id,
      table : this.table,
      children : this.children.map(child => child.toJSON())
    }
    return obj
  }

}

module.exports = LexicalScope