import { productListQuerySchema } from '#shared/schemas/catalog'
import { listProducts } from '../../adapters/dummyjson/catalog'

export default defineCachedEventHandler(
  async (event) => {
    const query = await getValidatedQuery(event, productListQuerySchema.parse)
    const { client, currency } = useCatalogApi(event)
    try {
      return await listProducts(client, query, currency)
    } catch (error) {
      throw toHttpError(error)
    }
  },
  { maxAge: 60 * 10, swr: true, getKey: (event) => `products:list:${getRequestURL(event).search}` },
)
