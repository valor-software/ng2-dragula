System.register(['dragula', '@angular/core'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var dragula, core_1;
    var DragulaService;
    return {
        setters:[
            function (dragula_1) {
                dragula = dragula_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            DragulaService = (function () {
                function DragulaService() {
                    this.cancel = new core_1.EventEmitter();
                    this.cloned = new core_1.EventEmitter();
                    this.drag = new core_1.EventEmitter();
                    this.dragend = new core_1.EventEmitter();
                    this.drop = new core_1.EventEmitter();
                    this.out = new core_1.EventEmitter();
                    this.over = new core_1.EventEmitter();
                    this.remove = new core_1.EventEmitter();
                    this.shadow = new core_1.EventEmitter();
                    this.dropModel = new core_1.EventEmitter();
                    this.removeModel = new core_1.EventEmitter();
                    this.events = [
                        'cancel',
                        'cloned',
                        'drag',
                        'dragend',
                        'drop',
                        'out',
                        'over',
                        'remove',
                        'shadow',
                        'dropModel',
                        'removeModel'
                    ];
                    this.bags = [];
                }
                DragulaService.prototype.add = function (name, drake) {
                    var bag = this.find(name);
                    if (bag) {
                        throw new Error('Bag named: "' + name + '" already exists.');
                    }
                    bag = {
                        name: name,
                        drake: drake
                    };
                    this.bags.push(bag);
                    if (drake.models) {
                        this.handleModels(name, drake);
                    }
                    if (!bag.initEvents) {
                        this.setupEvents(bag);
                    }
                    return bag;
                };
                DragulaService.prototype.find = function (name) {
                    for (var i = 0; i < this.bags.length; i++) {
                        if (this.bags[i].name === name) {
                            return this.bags[i];
                        }
                    }
                };
                DragulaService.prototype.destroy = function (name) {
                    var bag = this.find(name);
                    var i = this.bags.indexOf(bag);
                    this.bags.splice(i, 1);
                    bag.drake.destroy();
                };
                DragulaService.prototype.setOptions = function (name, options) {
                    var bag = this.add(name, dragula(options));
                    this.handleModels(name, bag.drake);
                };
                DragulaService.prototype.handleModels = function (name, drake) {
                    var _this = this;
                    var dragElm;
                    var dragIndex;
                    var dropIndex;
                    var sourceModel;
                    drake.on('remove', function (el, source) {
                        if (!drake.models) {
                            return;
                        }
                        sourceModel = drake.models[drake.containers.indexOf(source)];
                        sourceModel.splice(dragIndex, 1);
                        // console.log('REMOVE');
                        // console.log(sourceModel);
                        _this.removeModel.emit([name, el, source]);
                    });
                    drake.on('drag', function (el, source) {
                        dragElm = el;
                        dragIndex = _this.domIndexOf(el, source);
                    });
                    drake.on('drop', function (dropElm, target, source) {
                        if (!drake.models || !target) {
                            return;
                        }
                        dropIndex = _this.domIndexOf(dropElm, target);
                        sourceModel = drake.models[drake.containers.indexOf(source)];
                        // console.log('DROP');
                        // console.log(sourceModel);
                        if (target === source) {
                            sourceModel.splice(dropIndex, 0, sourceModel.splice(dragIndex, 1)[0]);
                        }
                        else {
                            var notCopy = dragElm === dropElm;
                            var targetModel = drake.models[drake.containers.indexOf(target)];
                            var dropElmModel = notCopy ? sourceModel[dragIndex] : JSON.parse(JSON.stringify(sourceModel[dragIndex]));
                            if (notCopy) {
                                sourceModel.splice(dragIndex, 1);
                            }
                            targetModel.splice(dropIndex, 0, dropElmModel);
                            target.removeChild(dropElm); // element must be removed for ngFor to apply correctly
                        }
                        _this.dropModel.emit([name, dropElm, target, source]);
                    });
                };
                DragulaService.prototype.setupEvents = function (bag) {
                    bag.initEvents = true;
                    var that = this;
                    var emitter = function (type) {
                        function replicate() {
                            var args = Array.prototype.slice.call(arguments);
                            that[type].emit([bag.name].concat(args));
                        }
                        bag.drake.on(type, replicate);
                    };
                    this.events.forEach(emitter);
                };
                DragulaService.prototype.domIndexOf = function (child, parent) {
                    return Array.prototype.indexOf.call(parent.children, child);
                };
                DragulaService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], DragulaService);
                return DragulaService;
            })();
            exports_1("DragulaService", DragulaService);
        }
    }
});
//# sourceMappingURL=dragula.provider.js.map