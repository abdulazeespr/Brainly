export const RandomString = (StringLen :number)=>{
    let options = "dgaDLIHWsowsdogo2w13456789"

    let optLen = options.length

    let ans = ""

    for(let i=0 ;i < StringLen; i++){
       ans += options[Math.floor((Math.random()* optLen))]
    }

    return ans

}