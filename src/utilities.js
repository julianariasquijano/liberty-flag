'use strict';

function setBreadcrumbCookieList (ctx,newBreadcrumb){

    let breadcrumb = JSON.parse(ctx.session.breadcrumb)
   
    let stringifiedNewBreadcrumb = JSON.stringify(newBreadcrumb)
    let breadcrumbElementExists = false
    let breadcrumbElementCounter = 0
    for (let breadcrumbIndex = 0; breadcrumbIndex < breadcrumb.length; breadcrumbIndex++) {

      if(JSON.stringify(breadcrumb[breadcrumbIndex]) === stringifiedNewBreadcrumb){
        breadcrumbElementExists = true
        breadcrumbElementCounter = breadcrumbIndex
        break

      }         
    }
    
    if(!breadcrumbElementExists){
      breadcrumb.push(newBreadcrumb)
      
    }
    else {
      let tempList = []
      for (let index = 0; index <= breadcrumbElementCounter; index++) {
        tempList.push(breadcrumb[index])
        
      }
      breadcrumb = tempList
    }
    ctx.session.breadcrumb = JSON.stringify(breadcrumb);
    return breadcrumb
    
}
exports.setBreadcrumbCookieList = setBreadcrumbCookieList