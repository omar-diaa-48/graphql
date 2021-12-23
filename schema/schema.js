const { default: axios } = require('axios');
const graphql = require('graphql');
const _ = require('lodash');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = graphql;


const users = [
    {id:'23',firstName:'Bill', age:20},
    {id:'47', firstName:'Samantha', age:21}
]

const axiosInstance = axios.create({
    baseURL:'http://localhost:3000'
})

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: {type:GraphQLString},
        name: {type:GraphQLString},
        description: {type:GraphQLString},
        users:{
            type: new GraphQLList(UserType),
            resolve(parentValue, args){
                return axiosInstance.get(`/companies/${parentValue.id}/users`)
                    .then(res => res.data)
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString},
        firstName: { type: GraphQLString},
        age: { type: GraphQLInt},
        company: {
            type: CompanyType,
            resolve(parentValue, args){
                return axiosInstance.get(`/companies/${parentValue.companyId}`)
                    .then(res => res.data)
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args){
                return axiosInstance.get(`/users/${args.id}`)
                    .then(res => res.data)
            }
        },
        company:{
            type: CompanyType,
            args: {id: {type:GraphQLString}},
            resolve(parentValue, args){
                return axiosInstance.get(`/companies/${args.id}`)
                    .then(res => res.data)
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})