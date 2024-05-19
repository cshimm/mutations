import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {FetchPosts} from "./components/FetchPosts";
import {CreatePost} from "./components/CreatePost";

export default function App() {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            <FetchPosts queryClient={queryClient}/>
            <CreatePost queryClient={queryClient}/>
        </QueryClientProvider>
    )
}
