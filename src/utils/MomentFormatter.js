import moment from 'moment';

export default class MomentFormatter {
  /**
  * 格式化日期为 YYYY-MM-DD
  * @param {Date|string} date - 日期对象或日期字符串
  * @returns {string} 格式化后的日期字符串
  */
  static formatDate (date) {
    return moment(date).format('YYYY-MM-DD');
  }

  /**
   * 格式化日期为 YYYY-MM-DD HH:mm:ss
   * @param {Date|string} date - 日期对象或日期字符串
   * @returns {string} 格式化后的日期时间字符串
   */
  static formatDateTime (date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  }

  /**
   * 格式化日期为自定义格式
   * @param {Date|string} date - 日期对象或日期字符串
   * @param {string} format - 格式化字符串（如 "YYYY/MM/DD"）
   * @returns {string} 格式化后的日期字符串
   */
  static formatCustom (date, format) {
    return moment(date).format(format);
  }

  /**
   * 计算日期差
   * @param {Date|string} startDate - 开始日期
   * @param {Date|string} endDate - 结束日期
   * @param {string} unit - 单位（如 "days", "months", "years"）
   * @returns {number} 日期差值
   */
  static diff (startDate, endDate, unit = 'days') {
    return moment(endDate).diff(moment(startDate), unit);
  }

  /**
   * 添加时间
   * @param {Date|string} date - 日期对象或日期字符串
   * @param {number} amount - 数量
   * @param {string} unit - 单位（如 "days", "months", "years"）
   * @returns {string} 添加后的日期字符串
   */
  static add (date, amount, unit) {
    return moment(date).add(amount, unit).format('YYYY-MM-DD');
  }

  /**
   * 减去时间
   * @param {Date|string} date - 日期对象或日期字符串
   * @param {number} amount - 数量
   * @param {string} unit - 单位（如 "days", "months", "years"）
   * @returns {string} 减去后的日期字符串
   */
  static subtract (date, amount, unit) {
    return moment(date).subtract(amount, unit).format('YYYY-MM-DD');
  }
}