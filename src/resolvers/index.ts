import { mergeResolvers } from "@graphql-tools/merge";
import StudentResolver from "./StudentResolver";
import TeacherResolver from "./TeacherResolver";
import BookResolver from "./BookResolver";
import { cacheResolver } from "../config/cacheHelper";

type Resolvers = {
    Query?: Record<string, Function>;
    Mutation?: Record<string, Function>;
    [key: string]: any
}

const applyCaching = (resolvers: Resolvers) => {
    if (resolvers.Query) {
        for (const key in resolvers.Query) {
            resolvers.Query[key] = cacheResolver(resolvers.Query[key]);
        }
    }
    return resolvers
}

const mergedResolver = mergeResolvers([
    applyCaching(StudentResolver),
    applyCaching(TeacherResolver),
    applyCaching(BookResolver)
])

export default mergedResolver