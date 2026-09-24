const worker = {
  async fetch(): Promise<Response> {
    return new Response("Worker ready");
  },
};

export default worker;
