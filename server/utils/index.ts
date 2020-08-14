export const array_chunks = (array, chunk_size) =>
    Array(Math.ceil(array.length / chunk_size))
        .fill(0)
        .map((_, index) => index * chunk_size)
        .map(begin => array.slice(begin, begin + chunk_size))
