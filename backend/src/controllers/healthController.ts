export const healthController = {
  getHealth: (_req: any, res: any) => {
    res.status(200).json({ status: 'ok' });
  },
};
