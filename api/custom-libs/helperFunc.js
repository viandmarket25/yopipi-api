let helperFunc={
  addslashes:(str) =>{
      return (str + '')
        .replace(/[\\"']/g, '\\$&')
        .replace(/\u0000/g, '\\0');
  },
  convertToNumber:(value)=>{
    if(typeof value=="string"){
      value=parseInt(value)
      value=Math.round(value * 100) / 100;
    }
    console.log(value)
    return value
  },
  generateUniqueId:(prefix,suffix)=>{
      let masterId ="";
      const current = new Date();
      const time_ = current.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
      });
      const timeElapsed = Date.now();
      const today = new Date(timeElapsed);
      today.toDateString(); // "Sun Jun 14 2020"
      let date_=today  // :::[ STRING ]
      let rand1=  Math.floor((Math.random() * 2300) + 1);
      let rand2=  Math.floor((Math.random() * 2300) + 1);
      masterId = prefix+''+''+date_+time_+rand1+rand2+''+suffix;
      masterId = masterId.split(".").join("");
      masterId = masterId.split("-").join("");
      masterId = masterId.split(":").join("");
      masterId = masterId.split(" ").join("");
      masterId = masterId.split("+").join("");
      masterId = masterId.split("(ChinaStandardTime)").join("");
      return masterId;
  },
  getTime:(type)=>{
    const current = new Date();
    const time_ = current.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    today.toDateString();
    return type=='time'?time_:today;
  },
  notEmpty:(value)=>{
    if(value!=='' && value!==null && value!==undefined){
      return true;
    }else{
      return false;
    }
  },
}
module.exports=helperFunc;
