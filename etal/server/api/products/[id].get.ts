import { productIdParamSchema } from '#shared/schemas/catalog'
import { getProduct } from '../../adapters/dummyjson/catalog'

export default defineCachedEventHandler(
  async (event) => {
    const { id } = await getValidatedRouterParams(event, productIdParamSchema.parse)
    const { client, currency } = useCatalogApi(event)
    try {
      return await getProduct(client, id, currency)
    } catch (error) {
      throw toHttpError(error)
    }
  },
  { maxAge: 60 * 10, swr: true, getKey: (event) => `products:detail:${getRouterParam(event, 'id')}` },
)
