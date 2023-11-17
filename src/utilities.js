'use strict';

function setBreadcrumbCookieList (ctx,newBreadcrumb = "",baseCrumbs = -1){

    let tempList = []

    if(typeof ctx.session.breadcrumbs === "undefined"){
      ctx.session.breadcrumbs = JSON.stringify([])
    }
    let breadcrumbs = JSON.parse(ctx.session.breadcrumbs)

    if (baseCrumbs > -1){

      for (let index = 0; index <= baseCrumbs; index++) {
        tempList.push(breadcrumbs[index])
        
      }
      breadcrumbs = tempList      

    }
    
    if(newBreadcrumb !== ""){
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
        tempList = []
        for (let index = 0; index <= breadcrumbElementCounter; index++) {
          tempList.push(breadcrumbs[index])
          
        }
        breadcrumbs = tempList
      }
    }

    
    ctx.session.breadcrumbs = JSON.stringify(breadcrumbs);
    return breadcrumbs
    
}
exports.setBreadcrumbCookieList = setBreadcrumbCookieList