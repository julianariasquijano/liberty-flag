'use strict';

function setBreadcrumbCookieList (ctx,newBreadcrumb){

    if(typeof ctx.session.breadcrumbs === "undefined"){
      ctx.session.breadcrumbs = JSON.stringify([])
    }
    let breadcrumbs = JSON.parse(ctx.session.breadcrumbs)
   
    let stringifiedNewBreadcrumb = JSON.stringify(newBreadcrumb)
    let breadcrumbElementExists = false
    let breadcrumbElementCounter = 0
    for (let breadcrumbIndex = 0; breadcrumbIndex < breadcrumbs.length; breadcrumbIndex++) {

      if(JSON.stringify(breadcrumbs[breadcrumbIndex]) === stringifiedNewBreadcrumb){
        breadcrumbElementExists = true
        breadcrumbElementCounter = breadcrumbIndex
        break

      }         
    }
    
    if(!breadcrumbElementExists){
      breadcrumbs.push(newBreadcrumb)
      
    }
    else {
      let tempList = []
      for (let index = 0; index <= breadcrumbElementCounter; index++) {
        tempList.push(breadcrumbs[index])
        
      }
      breadcrumbs = tempList
    }
    ctx.session.breadcrumbs = JSON.stringify(breadcrumbs);
    return breadcrumbs
    
}
exports.setBreadcrumbCookieList = setBreadcrumbCookieList