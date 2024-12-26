export default function handler(req, res) {
    if (req.method === 'POST') {
      const { username, password } = req.body;
  
      // Exemplo MUITO simples de login (usar bcrypt, etc. na produção!)
      if (username === 'admin' && password === '123') {
        // Simulação de "sessão" via cookie (bem básico):
        // Em produção, implemente tokens JWT ou cookies de sessão robustos.
        res.setHeader(
          'Set-Cookie',
          `adminToken=123456; HttpOnly; Path=/; Max-Age=3600;`
        );
        return res.status(200).json({ message: 'Login successful' });
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  }
  