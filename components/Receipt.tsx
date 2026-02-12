
import React from 'react';
import { Order } from '../types';

interface ReceiptProps {
  order: Order;
}

export const Receipt: React.FC<ReceiptProps> = ({ order }) => {
  return (
    <div className="p-8 bg-white text-black font-mono w-[80mm] border border-gray-200">
      <div className="text-center border-b border-dashed border-black pb-4 mb-4">
        <h2 className="text-lg font-bold uppercase tracking-tight">CH LITORAL</h2>
        <p className="text-[10px] uppercase font-bold">Produção e Logística</p>
      </div>
      
      <div className="mb-4 text-[10px] space-y-1">
        <p><strong>PEDIDO:</strong> #{order.id.slice(0, 8).toUpperCase()}</p>
        <p><strong>DATA:</strong> {new Date(order.createdAt).toLocaleString('pt-BR')}</p>
        <p>--------------------------------</p>
        <p><strong>CLIENTE:</strong> {order.customerName.toUpperCase()}</p>
        <p><strong>WHATSAPP:</strong> {order.whatsapp}</p>
        {order.companyName && <p><strong>EMPRESA:</strong> {order.companyName.toUpperCase()}</p>}
        
        <div className="bg-black text-white p-2 mt-2 mb-2 font-bold text-center text-xs uppercase">
          {order.deliveryMethod === 'PICKUP' ? 'RETIRADA EM LOJA' : 'ENTREGA EM DOMICÍLIO'}
        </div>

        {order.deliveryDate && (
          <p className="text-center font-bold border border-black p-1">
            AGENDADO: {new Date(order.deliveryDate).toLocaleDateString('pt-BR')} {order.deliveryTime && ` às ${order.deliveryTime}`}
          </p>
        )}
        
        <div className="pt-2 border-t border-dotted border-black mt-2">
          {order.deliveryMethod === 'PICKUP' ? (
            <>
              <p><strong>LOJA:</strong> {order.pickupStore?.toUpperCase()}</p>
            </>
          ) : (
            <>
              <p><strong>BAIRRO:</strong> {order.neighborhood?.toUpperCase()}</p>
              <p><strong>ENDEREÇO:</strong> {order.address?.toUpperCase()}, {order.addressNumber}</p>
              {order.complement && <p><strong>OBS:</strong> {order.complement.toUpperCase()}</p>}
              {order.cep && <p><strong>CEP:</strong> {order.cep}</p>}
            </>
          )}
        </div>
      </div>

      <div className="border-b border-dashed border-black mb-4">
        <p className="text-[10px] font-bold mb-2 uppercase">Itens Selecionados:</p>
        {order.items.map((item, idx) => (
          <div key={idx} className="mb-3">
            <div className="grid grid-cols-6 text-[10px] font-bold">
              <span className="col-span-1">{item.quantity}X</span>
              <span className="col-span-3">{item.DESCRICAO.toUpperCase()}</span>
              <span className="col-span-2 text-right">R$ {(item.PRECO * item.quantity).toFixed(2)}</span>
            </div>
            {item.notes && (
              <div className="text-[9px] pl-4 italic border-l-2 border-black mt-1">
                >> {item.notes.toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-1 border-t border-black pt-2 mb-4">
        {order.deliveryFee && order.deliveryFee > 0 && (
          <div className="flex justify-between text-[10px] font-bold">
            <span>TAXA ENTREGA:</span>
            <span>R$ {order.deliveryFee.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-black text-xl">
          <span>TOTAL:</span>
          <span>R$ {order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center text-[9px] mt-10 border-t border-dashed border-black pt-4">
        <p>Obrigado pela preferência!</p>
        <p>Acompanhe seu pedido pelo WhatsApp.</p>
        <p>*** FIM DO COMPROVANTE ***</p>
      </div>
    </div>
  );
};
