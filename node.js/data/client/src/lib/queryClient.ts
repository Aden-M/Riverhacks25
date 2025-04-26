import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const baseUrl = queryKey[0] as string;
    
    // Check if query parameters are provided in the query key
    let url = baseUrl;
    if (queryKey.length > 1) {
      // If the queryKey has more than one element, build query parameters
      const params = new URLSearchParams();
      
      // Handle special case for location parameters
      if (baseUrl.includes('/api/services/nearby') && queryKey.length >= 3) {
        const latitude = queryKey[1];
        const longitude = queryKey[2];
        
        if (latitude !== undefined && longitude !== undefined) {
          params.append('latitude', String(latitude));
          params.append('longitude', String(longitude));
          
          // Add radius if provided
          if (queryKey.length >= 4) {
            const radius = queryKey[3];
            if (radius !== undefined) {
              params.append('radius', String(radius));
            }
          }
        }
      }
      
      // Append query parameters to the URL
      if (params.toString()) {
        url = `${baseUrl}?${params.toString()}`;
      }
    }
    
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
