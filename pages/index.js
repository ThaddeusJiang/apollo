import { GraphQLClient, gql } from "graphql-request";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { ReactQueryDevtools } from "react-query/devtools";

const endpoint = "https://apollo-dispatch.hasura.app/v1/graphql";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "content-type": "application/json",
    "x-hasura-admin-secret":
      "sM4f2lW458zeUkxFW0P1oOs56MK8XPcHhYZBZSpWDgKl7iwVGkJ0WdqNnWoxMobL",
  },
});

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <JobDefinitions />
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}

function useJobDefinitions() {
  return useQuery("jobDefinitions", async () => {
    const { jobDefinitions } = await graphQLClient.request(
      gql`
        {
          jobDefinitions {
            id
            host
            active
            name
            on
            runUrl
            runMethod
            runBody
          }
        }
      `
    );
    console.debug(jobDefinitions);
    return jobDefinitions;
  });
}

function JobDefinitions() {
  const { status, data, error, isFetching } = useJobDefinitions();

  return (
    <div>
      <h1>Job Definitions</h1>
      <div>
        {status === "loading" ? (
          "Loading..."
        ) : status === "error" ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <div>
              {data.map((item) => (
                <p key={item.id}>{item.name}</p>
              ))}
            </div>
            <div>{isFetching ? "Background Updating..." : " "}</div>
          </>
        )}
      </div>
    </div>
  );
}
