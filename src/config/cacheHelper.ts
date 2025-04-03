import redisClient from "./redisClient";
import {GraphQLResolveInfo} from "graphql";

const CACHE_TTL = 60 * 5; // 5 minutes


export const cacheResolver = (resolver:Function)=>{
     return async(parent:any,args:any,context:any,info:GraphQLResolveInfo)=>{
         try{
             const key = `${info.fieldName}:${JSON.stringify(args)}`

             const cachedData = await redisClient.get(key)
             if(cachedData){
                console.log(`Cache hit:${key}`)
                return JSON.parse(cachedData)
             }
             
             // Excute original resolver function
             const result = await resolver(parent,args,context,info);

             //cache the result
             await redisClient.setEx(key,CACHE_TTL,JSON.stringify(result))
             console.log(`Cache set: ${key}`)
             
             return result

         }catch(error){
            console.error("Redis Cache Error:", error);
            return resolver(parent, args, context, info);
         }
     }
}
