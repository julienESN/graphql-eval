import {ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import Cookies from 'js-cookie';

const httpLink = createHttpLink({
    uri: import.meta.env.VITE_API_URL, // Adresse de votre serveur GraphQL
});

const authLink = setContext((_, {headers}) => {
    const token = Cookies.get('token');
    return {
        headers: {
            ...headers,
            Authorization: token ? `${token}` : "",
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;