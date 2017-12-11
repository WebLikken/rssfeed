global.__base = __dirname.replace('test','') + '/';
console.log(__base);

describe('Array', function(){
    describe.only('#indexOf()', function(){
    });
});
let assert = require('assert');

assert(typeof 'foobar' ==='string');


describe('category-service ==> getCategoryIfExists', function(){
    let categoryService = require(__base+'services/category-service.js');
    let mockCategories=[{IDUser:'a941c1b0-d548-11e7-b68b-2df884680a57', text:'webdesign', IDCategory:'57e1ccc0-da89-11e7-a033-cb14e891c510', title:'webdesign'},{IDUser:'a941c1b0-d548-11e7-b68b-2df884680a57', text:'Cinema', IDCategory:'57e1ccc1-da89-11e7-a033-cb14e891c510', title:'Cinema'},{IDUser:'a941c1b0-d548-11e7-b68b-2df884680a57', text:'WebDev News', IDCategory:'57e1ccc2-da89-11e7-a033-cb14e891c510', title:'WebDev News'},{IDUser:'a941c1b0-d548-11e7-b68b-2df884680a57', text:'Angular', IDCategory:'57e1ccc3-da89-11e7-a033-cb14e891c510', title:'Angular'},{IDUser:'a941c1b0-d548-11e7-b68b-2df884680a57', text:'technologie', IDCategory:'57e1ccc4-da89-11e7-a033-cb14e891c510', title:'technologie'},{IDUser:'a941c1b0-d548-11e7-b68b-2df884680a57', text:'Inspiration', IDCategory:'57e1ccc5-da89-11e7-a033-cb14e891c510', title:'Inspiration'},{IDUser:'a941c1b0-d548-11e7-b68b-2df884680a57', text:'css', IDCategory:'57e1ccc6-da89-11e7-a033-cb14e891c510', title:'css'},{IDUser:'a941c1b0-d548-11e7-b68b-2df884680a57', text:'Informatique', IDCategory:'57e1ccc7-da89-11e7-a033-cb14e891c510', title:'Informatique'},{IDUser:'a941c1b0-d548-11e7-b68b-2df884680a57', text:'Front end', IDCategory:'57e1ccc8-da89-11e7-a033-cb14e891c510', title:'Front end'},{IDUser:'a941c1b0-d548-11e7-b68b-2df884680a57', text:'web', IDCategory:'57e1ccc9-da89-11e7-a033-cb14e891c510', title:'web'},{IDUser:'a941c1b0-d548-11e7-b68b-2df884680a57', text:'javascript', IDCategory:'57e1ccca-da89-11e7-a033-cb14e891c510', title:'javascript'},{IDUser:'a941c1b0-d548-11e7-b68b-2df884680a57', text:'hardware', IDCategory:'57e1cccb-da89-11e7-a033-cb14e891c510', title:'hardware'},{IDUser:'a941c1b0-d548-11e7-b68b-2df884680a57', text:'web development', IDCategory:'57e1cccc-da89-11e7-a033-cb14e891c510', title:'web development'},{IDUser:'a941c1b0-d548-11e7-b68b-2df884680a57', text:'Sans catégorie', IDCategory:'57e1cccd-da89-11e7-a033-cb14e891c510', title:'Sans catégorie'}];
    assert.ok(categoryService.getCategoryIfExists({ text: 'webdesign',title: 'webdesign' },mockCategories));
    assert.ok(!categoryService.getCategoryIfExists({ text: 'blah',title: 'webdesign' },mockCategories));
    assert.ok(!categoryService.getCategoryIfExists({ text: 'webdesign',title: 'blah' },mockCategories));
    assert.ok(!categoryService.getCategoryIfExists({ text: 'webdesign' },mockCategories));
    assert.ok(!categoryService.getCategoryIfExists({ title: 'webdesign' },mockCategories));
    assert.ok(!categoryService.getCategoryIfExists({  },mockCategories));
    assert.ok(!categoryService.getCategoryIfExists({ text: null,title: null },mockCategories));
    assert.ok(!categoryService.getCategoryIfExists({ text: undefined,title: undefined },mockCategories));
});
