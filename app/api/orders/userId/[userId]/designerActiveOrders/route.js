// model user ke accpted orders
/*
import pool from "@/app/lib/db";

export async function GET(req, { params }) {
  const { userId } = params; // Extract the user_id from the request params

  try {
    const result = await pool.query(
      `
      SELECT 
        mo.order_id, 
        mo.status, 
        u.name AS designer_name
      FROM 
        "model_orders" mo
      JOIN 
        "Designers" d ON mo.designer_id = d.designer_id
      JOIN 
        "Users" u ON d.user_id = u.user_id
      WHERE 
        mo.user_id = $1 AND mo.status = $2
      `,
      [userId, "accepted"]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "No active orders found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch active orders for user:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}
*/

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch user's accepted orders
export async function GET(req, { params }) {
  const { userId } = params; // Extract the user_id from the request params

  try {
    // Fetch model orders with Prisma
    const orders = await prisma.model_orders.findMany({
      where: {
        user_id: parseInt(userId, 10), // Ensure userId is an integer
        status: "accepted", // Only select orders with "accepted" status
      },
      select: {
        order_id: true,
        status: true,
        Designers: {
          select: {
            Users: {
              select: {
                name: true, // Get the designer's name associated with the order
              },
            },
          },
        },
      },
    });

    if (orders.length === 0) {
      return new Response(JSON.stringify({ error: "No active orders found" }), {
        status: 404,
      });
    }

    // Map the response to match the original structure
    const formattedOrders = orders.map((order) => ({
      order_id: order.order_id,
      status: order.status,
      designer_name: order.Designers.Users.name,
    }));

    return new Response(JSON.stringify(formattedOrders), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch active orders for user:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}
