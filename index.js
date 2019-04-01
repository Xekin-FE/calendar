// components/calendar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: String,
    size: String,
    type: {
      value: 'date',
      type:String,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    title: '',
    weekday_cn:['一','二','三','四','五','六','七'],
    month_dateNum:[31,28,31,30,31,30,31,31,30,31,30,31],
    table: 'date',
    today: [],
    isTodayIndex: null,
    swiperDate: null,
    swiperYear: null,
    years:[],
    month: [],
    swiperDatas: [],
    swiperCurrent: 0,
  },
  ready(){
    this.init()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init(){
      let dateObj = new Date(this.data.value);
      this.setData({table:this.data.type})
      this.data.swiperDate = dateObj;
      let year = dateObj.getFullYear();
      this.data.swiperYear = year;
      let month = dateObj.getMonth() + 1;
      let date = dateObj.getDate();
      let result = this.getMonthAllDate(dateObj);
      this.data.swiperDatas.push(result);
      this.setData({
        today: [year, month, date],
        swiperDatas: this.data.swiperDatas,
        title: `${year}年${month}月`
      })
    },
    switchTable(){
      if(this.data.table === 'date') {
        let result = this.getMonths(this.data.today[0])
        this.setData({
          table: 'month',
          swiperDatas: [result],
          title: `${this.data.today[0]}年`,
        })
      }else if(this.data.table === 'month'){
        let result = this.getYears(this.data.today[0])
        this.setData({
          table: 'year',
          swiperDatas: [result],
          title: `${this.data.today[0]-6}年-${this.data.today[0]+5}年`
        })
      }
      return
    },
    selectYear(event){
      if(this.data.type === 'year') {
        let result = this.data.today[0];
        this.triggerEvent('select', result);
        return
      }else{
        let year = event.currentTarget.dataset.year.year;
        let result = this.getMonths(year);
        this.data.swiperDatas = [result];
        this.setData({
          swiperDatas: this.data.swiperDatas,
          swiperYear: year,
          table: 'month',
          title: `${year}年`
        });
      }
    },
    selectMonth(event){
      if(this.data.type === 'month') {
        let result = this.data.today.slice(0,2)
        this.triggerEvent('select', result)
        return
      }else{
        let month = event.currentTarget.dataset.month+1;
        let date = new Date(`${this.data.swiperYear}-${month}`);
        let result = this.getMonthAllDate(date);
        this.data.swiperDatas = [result];
        this.setData({
          swiperDatas: this.data.swiperDatas,
          swiperDate: date,
          table: 'date',
          title: `${this.data.swiperYear}年${month}月`,
        });
      }
    },
    selectDate(event){
      const {item, index} = event.currentTarget.dataset
      let delAim = `swiperDatas[0][${this.data.isTodayIndex}].isToday`
      let addAim = `swiperDatas[0][${index}].isToday`
      let result = `${item.year}-${item.month}-${item.date}`;
      this.setData({
        isTodayIndex: index,
        today: [item.year,item.month,item.date],
        [delAim]: false,
        [addAim]: true
      })
      this.triggerEvent('select', result);
    },
    preventEvent(){
      return false
    },
    prev(){
      switch (this.data.table) {
        case 'date':
          let year = this.data.swiperDate.getFullYear();
          let month = this.data.swiperDate.getMonth()+1;
          // 获取上个月份的显示对象
          let dateObj = new Date(`${month-1===0?year-1:year}-${month-1===0?12:month-1}`);
          // 上个月显示信息
          let dates = this.getMonthAllDate(dateObj);
          this.data.swiperDatas.splice(0,0,dates);
          this.setData({
            swiperYear: dateObj.getFullYear(),
            swiperDate: dateObj,
            swiperDatas: this.data.swiperDatas,
            title: `${month===1?year-1:year}年${month===1?12:month-1}月`,
            swiperCurrent: 1,
          })
          break;
        case 'month':
          this.data.swiperYear--;
          let months = this.getMonths(this.data.selectYear);
          this.data.swiperDatas.splice(0,0,months);
          this.setData({
            swiperYear: this.data.swiperYear,
            swiperDatas: this.data.swiperDatas,
            title: `${this.data.swiperYear}年`,
            swiperCurrent: 1
          });
          break;
        case 'year':
          let years = this.getYears(this.data.swiperYear-12);
          this.data.swiperDatas.splice(0,0,years);
          this.data.swiperYear = this.data.swiperYear-12,
          this.setData({
            swiperDatas: this.data.swiperDatas,
            title: `${years[0].year}年-${years[11].year}年`,
            swiperCurrent: 1
          });
          break;
        default:
        break;
      }
      this.setData({
        swiperCurrent: 0,
      })
      setTimeout(() => {
        this.data.swiperDatas.pop()
        this.setData({swiperDatas: this.data.swiperDatas})
      }, 500);
    },
    next(){
      console.log(this.data.table)
      switch (this.data.table) {
        case 'date':
          let year = this.data.swiperDate.getFullYear()
          let month = this.data.swiperDate.getMonth()+1
          let dateObj = new Date(`${month===12?year+1:year}-${month===12?1:month+1}`)
          let dates = this.getMonthAllDate(dateObj)
          this.data.swiperDatas.push(dates)
          this.setData({
            swiperDate: dateObj,
            swiperDatas:this.data.swiperDatas,
            title: `${month>11?year+1:year}年${month>11?1:month+1}月`,
            swiperCurrent: 0
          })
        break;
        case 'month':
          this.data.swiperYear++;
          let months = this.getMonths(this.data.swiperYear);
          this.data.swiperDatas.push(months);
          this.setData({
            swiperYear: this.data.swiperYear,
            swiperDatas: this.data.swiperDatas,
            title: `${this.data.swiperYear}年`,
            swiperCurrent: 0
          });
        break;
        case 'year':
          let years = this.getYears(this.data.swiperYear+12)
          this.data.swiperDatas.push(years)
          this.data.swiperYear = this.data.swiperYear+12,
          this.setData({
            swiperDatas: this.data.swiperDatas,
            title: `${years[0].year}年-${years[11].year}年`,
            swiperCurrent: 0
          })
        break;
        default:
          break;
      }
      this.setData({swiperCurrent: 1})
      setTimeout(() => {
        this.data.swiperDatas.splice(0,1)
        this.setData({
          swiperDatas: this.data.swiperDatas,
          swiperCurrent: 0
        })
      }, 500);
    },
    getYears(year){
      let result = []
      for (let i = year-6; i<year+6; i++){
        let current = i == this.data.today[0]
        result.push({
          current,
          year: i
        })
      }
      console.log(result, this.data.today[0])
      return result
    },
    getMonths(year){
      let result = []
      for (let i = 1; i<13; i++){
        let current = i == this.data.today[1] && year === this.data.today[0]
        result.push({
          current,
          month: i
        })
      }
      console.log(result, this.data.today[1], this.data.today[0])
      return result
    },
    getMonthAllDate(dateObj){
      this.getFebDates(dateObj);
      // 获取这个月的数据
      let result = [];
      let tobj = new Date(this.data.value)
      let year = dateObj.getFullYear()
      let month = dateObj.getMonth() +1
      let date = dateObj.getDate()
      // 获取这个月的第一天是星期几
      let first_day = new Date(`${year}-${month}-1`).getDay()
      // 上个月总天数
      let last_month= month-2 >= 0 ? month-2 : 11
      let lastMonthDatesNumber = this.data.month_dateNum[last_month]
      // 这个月总天数
      let thisMonthDatesNumber = this.data.month_dateNum[month-1]
      // 这个月显示的第一天是哪天
      let date_num = lastMonthDatesNumber-first_day+1
      // 是否是当前月
      let current = false
      // 一个月显示42天信息
      let cursor = -1
      for(let i=0;i < 42; i++){
        if(date_num >= lastMonthDatesNumber && !current) {
          current = true
          date_num = 0
          cursor = 0
        }
        if(date_num >= thisMonthDatesNumber && current) {
          current = false
          date_num = 0
          cursor = 1
        }
        date_num++
        let isToday = month+Number(cursor) == tobj.getMonth()+1 && year === tobj.getFullYear() && date_num === tobj.getDate()
        if(isToday) this.data.isTodayIndex = i
        result.push({
          year:year,
          date:date_num,
          month: month+Number(cursor),
          current,
          isToday,
          cursor
        })
      }
      return result
    },
    getFebDates(dateObj){
      let Feb_dateNum = dateObj.getFullYear()%4 === 0 ? 29 : 28
      this.data.month_dateNum.splice(1,1,Feb_dateNum)
      this.setData({month_dateNum:this.data.month_dateNum})
    },
  }
})
