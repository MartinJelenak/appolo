const {ApolloServer} = require('apollo-server');
const fs = require('fs');
const path = require('path');

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const resolvers = {
    Query : {
        info: () => 'Info',
        feed: async (parent, args, context, info) => {
            return context.prisma.link.findMany()
        },
    },
    Mutation : {
        post: (parent, args, context, info) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                },
            })
            return newLink
        },
        deleteLink: (parent, args, context, info) => {
            const deleteLink = context.prisma.link.delete({
                where: {
                    id: +args.id,
                }
            })
            return deleteLink
        },
        updateLink: (parent,args,context,info) => {
            const updateLink = context.prisma.link.update({
                where:{
                    id: +args.id,
                },
                data:{
                    url: args.url,
                    description: args.description,
                }
            })
            return updateLink
        }
    }
    
}


const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: {
        prisma,
      }
})

server
    .listen()
    .then(({url})=>
        console.log(`Server is running on ${url}`)
    );
