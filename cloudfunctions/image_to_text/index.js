// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
/*
{
  "param":{
    "app_id": "2123531402",
    "image":"/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCADJAMkDASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAQMAAgQFBv/EAC4QAAICAQQBAwMEAAcAAAAAAAABAhEDBBIhMUEiUWEFE0IUMnGBBiM0Q1KRsf/EABgBAAMBAQAAAAAAAAAAAAAAAAABAgME/8QAHREBAQEBAAMBAQEAAAAAAAAAAAERAhIhQTFRYf/aAAwDAQACEQMRAD8A45OC325PgH2mvJHifkHAHKrLLG/JVRrgMPUjul0jpfScGCWp26l+mSpfyYoLgdjlTsuYmyvR5vpGmngcIRqXiVnCy6P7Utk4VJdnY+lfUIuCw5XT/Fvz8Gr6ho/1OPdBL7kevkuXPVRn8eZ+xHd0MjBJVRtWh1Em6wz/ALVFl9O1Cg5OFJK+WP1C/W76XrFPEsWR1KPC+Ucj/EeqxZ9RCGLl401J/PsJjqJ48lwdOLtMzZE53N9t22RbFSdVjcG30Xhhk/A+MFuGVtffhmd6aTkiOOCfJdYozi+KSIkt1M2YoY1B2/xZNqpy5Ek1KvBpwyio9mZu2GLbaSLZ1vTtBKYeI7WuRpKoBOQkrgAFE2hCAVpEpBoggm3sq48odVxA4+r+jfGM6ZpJ2J/J2bXHgy5lWonH2bRNmLl0YMZ8opi6LtV0SozHNxfZ2NP9Y244rJBza8o4aXIxP5NJf6iz+O1L6y7e3Cq+ZCcn1bPODjUFdp8HNT4LRfPRVwpL/Qlj27mZpt7TdqK2tmKuDml104XG9xem3z7BxxTyovL90gtEjPtfJojKo3fSFLtjlH0PgVpyOXfqZaMqFy4m/wCRtrhmjGw7BOTl+7/s2LowPbw4mvDkUor3RNENICyNiUhAN8kt2AEgCchoPXNURL1SZlhlcWaITTTd9m/PWsOubF1G3Fe7Rz83+qytf83/AOnTwc58Sr8kcub3ZJv3Yd/h8fpmNeksTFH0oLohaRLJlEw2GnhiZL4opbLY73q/cL16Eh2RNxF48Vxfwx2bLDGuezn5NXJblHhNmE2trZGhpQkLi7lL+DHLLKXbKxyzi7TLnNT5NqXqbrg0RyY5JpNWcyepm4uK4vsQpu+2Hho88GSub/ktKO2C5sqmW3XXwWzBOkadMrknuoRtjtvyTE3vpATqUSiYl6EOg8ahJSi3J9O+iMXpLXJCzIAVIGg0AZegptPhgdWRDDbo86/UY3N0lfP9HOXcn8l5tqhcemXuxMklasS9KI0HE04oL6H8T9UCkRkJUNFJZPt82XbSVmDPk3y+AwLZc0skm2xVgsFjwaPyV7JdhVIAG0rRdsr4YAEy9Cy8XwBLJl8CX3Yv5F35In5QG7EVxwFRbRg0+pa9MnwbE+OyQvXF2iNKuynglga/ALRUggzurLRqhb7LR6EazinGT9lYiP7R8nWGb+KELov4UMjJqqGrJapil4DHli0WHMhVBQyI1WTbHavJjsZqZXlYmyiEBLIAQJErGQhbEciii2H7bo1Qw34NMNMtvRN6X4uS4NESo25sG1mecKQ5dK8lkTAQaRumbtLnUo7X2c+y0JOMrQB10+CWJwZN8ExpIGyWBfySwNm9yy6KF0hGXqJNJRT4fYPCJqVSg/IOeCqUNSDHsqSHYjOI3SfJXwUyuoMaWLI7m2ULPsDKIA0XxQ3MZ9upoWqwIQs1YcIdPji2dDFjiuTPqtOYXjw0PUKQ1KJdpGdW5+ox2m6MUofB2ZwTMWbDtdpFSixx8kNs2hbN2oxetOjHNUzWXWPUxQIAlIbNI6fwzWmjJo+Ual2TTWtAtE4JwI2ay6KeS6YjK1f+2iJdFdU7ypeyCm+C+k8mBguWDmyQu2SoylRTUL/KdFrZXNbhRUSwMKVsjiXx8StjDZpcPptoatLufZMGojJKEY+pl5ZJ4XykZ3WsxR6LIuYyKb8+CVNsb+va7RWeeOXwL39Hr4Zi1Tb5NKz8WYscFJ8DZYpKIripp/6qCfLKz1WGSqzDKDky+PRKStsMg2rZZ45KkznaiNM3ZdLsXDMWoTSVlc/4jrc9s4zHjc2VStmvTwpFszMGPYhyKqwkmPkgCWAZ75LWUV2G+AgpOVuWRWNj4ETfrQ6HaK6Ln8akvTygbV4D+JSOS3QyW2oEumi3krLsLDn6RlxqMEyaWClJ2h2aDlFUDRRpsjfTTPbVi0+3LGcVxRqliUlyhcJbeBqmmQvGTJpItkx6WKdpGpq2WSSXaDRjFlShNKHE7S4HaqWSGG7T49hum0aln+5Lq7Q76hiU8W1ewrTkcqUJuCnffsJWfLB1yb8MFHCovspLFFvlD0srI80pp8v+zNlvJG/Y6OXDGMG0uaMjxbcba9iubEdaRp4bnb8GtKhWKGxDbKqFkwlbDYghCWCxBn3JFZ5FXBncmwWVIVq93JGiHaMiZowztpDojXfpYrG/UMv0isb9QUQ/yVmw36ismh0o16dRni57QuENmSVGeORx6dDdO3K3dmdjaXWkZHoolZdEqFi03LJtXJeXRnWX7Mm2gU62CVRr2K6qXBzsev8Afgvk1imkrFlPYpvak6Lbk/BSLTbZZ9ASs5JqmY5Tc5NfimPyy4ZkhJtsqM+jaITwTwUzQIO0FdAaUANOgCDmhI1RDRCFscts0yrIAb1JOFopB+ozY8jjx4HwfIqcPbVlJNAnNIRPIys0jJzVcDtDLtGG7H6WdToVnpXN9uvEskIxztDd/pMW0MVeSTwxmjDkztS+AS17qocCynsXzaapFFprkrKrVS9xmLUKXD7HfIvTQsaiuCsnSorHLuZJMRkzkoyTfuZt6lmm48JstqZ26QnF5LkZ9Hp8EsCImNAphTKphEFrABBAOeyBAzRKWAgAA2PUqgn5F44Xyy034RU5+lqKTk7ZWTthXCKsdADtMrmKitzNeGCiZ9VcPhPwOjK+zLdSHR5RFaQ5xht55KRw4Z2mkmVd0Z5uSfDoUitPyaKNXCYhYHF/uJ92fVhi5D9i3k2HpYcmVKPYtukZsk9wTnam3AnLdJsEHtYCWbZGOmrJ8BU0Jslh4waepWWTM6lQyM7JvJymWSwWSyDYg0Bcl0kjSTUWgoWWUUiWTk0khaKKS7DfJGBI+iiXJZ8oquGT0qH4o8miLE41wNi+zGtYki+HIk6YtsowGt9xYucVIyLM1wyyzixXlD1jjRaopGdZgSytiyjYrqMnhCfBJvdIBtzMjLq7VkBkRGWhETyRA8gFiAJYAyEuRliE6Zb7hn1PapSkqLAIaxAkIDyMAyLojIhGgGQjFTPxSuJe+ROHsa+zGzK0iNgbAAAEmCgsCGQpAnKlSCLl2ECIIEFmiE8kZPJGMIDyECAhImRgQAb5IDyERv/Z"
  },
  "app_key": "GD9uNRZd3Tl0ccp2"
}
*/
// 云函数入口函数
exports.main = async(event, context) => {

  const wxContext = cloud.getWXContext()

  let param = event.param
  console.log(param)
  let time_in_sec = Math.floor(new Date().getTime() / 1000)
  param["time_stamp"] = time_in_sec.toString();
  param["nonce_str"] = Math.random().toString(36).slice(-8)
  param["session_id"] = time_in_sec.toString();

  let res = await cloud.callFunction({
    // 要调用的云函数名称
    name: 'get_request_sign',
    // 传递给云函数的参数
    data: {
      param: param,
      app_key: event.app_key,
    }
  })
  param["sign"] = res.result.sign
  let tmp = param["image"]
  param["image"] = "image_b64"
  console.log(param)
  param["image"] = tmp

  let request = require('request-promise');
  res = await request.post({
    url: "https://api.ai.qq.com/fcgi-bin/vision/vision_imgtotext",
    form: param
  })

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    data: res
  }
}