export type NextFunction = () => Promise<unknown>;
export type Middleware<T> = (data: T, next: NextFunction) => Promise<unknown>;

/**
 *
 * @param {T} data
 * @param {Middleware<T>[]} middlewares
 * @param done
 * @returns {Promise<T>}
 */
export async function runMiddlewares<T>(
  data: T,
  middlewares: Middleware<T>[],
  done?: (data: T) => Promise<unknown>,
): Promise<T> {
  await (async function next(index: number) {
    if (middlewares.length === index) {
      return done?.(data);
    }

    await middlewares[index](data, async () => next(index + 1));
  })(0);

  return data;
}
