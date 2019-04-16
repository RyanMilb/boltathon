const chai = require('chai');
const crypto = require('../public/crypto.js');

describe('getRandom', function () {

    it("should return a random string of length passed as argument", function(){
        //minimum value
        var len = 1;
        chai.expect(crypto.getRandom(len).length).to.equal(len);
        //normal value
        len = 16;
        chai.expect(crypto.getRandom(len).length).to.equal(len);
        //maximum value
        len = 32;
        chai.expect(crypto.getRandom(len).length).to.equal(len);   
    }),
    
    it("should throw error below minimum value",function(){
        chai.expect(crypto.getRandom.bind(null,0)).to.throw(RangeError);
        chai.expect(crypto.getRandom.bind(null,-32)).to.throw(RangeError);
        chai.expect(crypto.getRandom.bind(null,-3333333333333)).to.throw(RangeError);
    }),

    it("should throw error above maximum value", function(){
        chai.expect(crypto.getRandom.bind(null,33)).to.throw(RangeError);
        chai.expect(crypto.getRandom.bind(null,33333333333333)).to.throw(RangeError);
    });
  });